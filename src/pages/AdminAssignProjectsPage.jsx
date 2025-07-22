import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function AdminAssignProjectsPage() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      // Load users (use your actual user table name/fields)
      const { data: userData } = await supabase.from("investors").select("id, email");
      setUsers(userData || []);
      // Load projects
      const { data: projectData } = await supabase.from("projects").select("id, name");
      setProjects(projectData || []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  useEffect(() => {
    if (!selectedUser) { setAssignments([]); return; }
    async function fetchAssignments() {
      const { data } = await supabase
        .from("investor_projects")
        .select("project_id")
        .eq("investor_id", selectedUser);
      setAssignments((data || []).map(row => row.project_id));
    }
    fetchAssignments();
  }, [selectedUser]);

  async function toggleAssignment(projectId) {
    setSaving(true);
    if (assignments.includes(projectId)) {
      await supabase
        .from("investor_projects")
        .delete()
        .eq("investor_id", selectedUser)
        .eq("project_id", projectId);
    } else {
      await supabase
        .from("investor_projects")
        .insert([{ investor_id: selectedUser, project_id: projectId }]);
    }
    // Refresh assignments
    const { data } = await supabase
      .from("investor_projects")
      .select("project_id")
      .eq("investor_id", selectedUser);
    setAssignments((data || []).map(row => row.project_id));
    setSaving(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Assign Projects to Users</h2>
      {loading ? "Loading..." : (
        <>
          <label>
            Select user:{" "}
            <select
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
            >
              <option value="">-- Select --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.email}</option>
              ))}
            </select>
          </label>
          {selectedUser && (
            <ul style={{ marginTop: 24 }}>
              {projects.map(proj => (
                <li key={proj.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={assignments.includes(proj.id)}
                      disabled={saving}
                      onChange={() => toggleAssignment(proj.id)}
                    />{" "}
                    {proj.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
