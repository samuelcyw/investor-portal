import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function AdminUserManagerPage() {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  const [investors, setInvestors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const [adding, setAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editing, setEditing] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Gate by admins table
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); navigate("/login"); return; }
      const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).single();
      if (!data) { setIsAdmin(false); navigate("/login"); return; }
      setIsAdmin(true);
    })();
  }, [navigate]);

  // Load investors + projects
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true); setError("");
      const [{ data: inv, error: invErr }, { data: pro, error: proErr }] = await Promise.all([
        supabase.from("investors").select("id, email"),
        supabase.from("projects").select("id, name"),
      ]);
      if (invErr) setError(invErr.message);
      if (proErr) setError((e) => e || proErr.message);
      setInvestors(inv || []);
      setProjects(pro || []);
      setLoading(false);
    })();
  }, [isAdmin]);

  // Load assignments when investor selected
  useEffect(() => {
    if (!selectedInvestor) { setAssignments([]); return; }
    (async () => {
      const { data, error } = await supabase
        .from("investor_projects")
        .select("project_id")
        .eq("investor_id", selectedInvestor.id);
      if (error) { setError(error.message); setAssignments([]); }
      else setAssignments((data || []).map(r => r.project_id));
    })();
  }, [selectedInvestor]);

  async function refreshInvestors() {
    const { data } = await supabase.from("investors").select("id, email");
    setInvestors(data || []);
  }

  // Add user (Auth + mirror to investors table)
  async function handleAddInvestor(e) {
    e.preventDefault(); setError(""); setAdding(true);
    try {
      const { data: sign, error: signErr } = await supabase.auth.signUp({ email: newEmail, password: newPassword });
      if (signErr) throw signErr;
      const uid = sign?.user?.id;
      if (!uid) throw new Error("Sign-up succeeded but user id missing.");
      const { error: insErr } = await supabase.from("investors").insert([{ id: uid, email: newEmail }]);
      if (insErr) throw insErr;
      await refreshInvestors();
      setNewEmail(""); setNewPassword("");
      alert("Investor created (they may need to confirm via email).");
    } catch (err) { setError(err.message); }
    finally { setAdding(false); }
  }

  // Edit investor (profile only)
  async function handleSaveEdit(e) {
    e.preventDefault(); if (!editing) return;
    setSavingEdit(true); setError("");
    try {
      const { error: updErr } = await supabase.from("investors").update({ email: editEmail }).eq("id", editing.id);
      if (updErr) throw updErr;
      await refreshInvestors();
      setEditing(null); setEditEmail("");
    } catch (err) { setError(err.message); }
    finally { setSavingEdit(false); }
  }

  // Assign/unassign projects
  async function toggleAssignment(projectId) {
    if (!selectedInvestor) return; setBusy(true);
    try {
      if (assignments.includes(projectId)) {
        const { error } = await supabase
          .from("investor_projects")
          .delete()
          .eq("investor_id", selectedInvestor.id)
          .eq("project_id", projectId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("investor_projects")
          .insert([{ investor_id: selectedInvestor.id, project_id: projectId }]);
        if (error) throw error;
      }
      const { data } = await supabase
        .from("investor_projects")
        .select("project_id")
        .eq("investor_id", selectedInvestor.id);
      setAssignments((data || []).map(r => r.project_id));
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  if (isAdmin === null) return <div style={{ padding: 24 }}>Checking admin…</div>;
  if (!isAdmin) return <div style={{ padding: 24 }}>Not authorized.</div>;
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <>
      <Header />
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "Inter, Arial, sans-serif" }}>
        <h2>Investor Management</h2>
        {error && <div style={{ color: "#b91c1c", margin: "8px 0" }}>{error}</div>}

        {/* Add investor */}
        <form onSubmit={handleAddInvestor} style={{ margin: "16px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input type="email" placeholder="New investor email" value={newEmail}
                 onChange={(e) => setNewEmail(e.target.value)} required style={{ padding: 8, minWidth: 280 }} />
          <input type="password" placeholder="Temp password" value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)} required style={{ padding: 8, minWidth: 200 }} />
          <button type="submit" disabled={adding} style={{ padding: "8px 12px" }}>
            {adding ? "Adding…" : "Add investor"}
          </button>
        </form>

        {/* List investors */}
        <h3>Investors</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {investors.map((inv) => (
            <li key={inv.id} style={{ padding: "10px 0", borderBottom: "1px solid #eee", display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>{inv.email}</div>
              <button onClick={() => setSelectedInvestor(inv)} style={{ padding: "6px 10px" }}>Assign projects</button>
              <button onClick={() => { setEditing(inv); setEditEmail(inv.email || ""); }}
                      style={{ padding: "6px 10px" }}>Edit</button>
            </li>
          ))}
        </ul>

        {/* Edit investor */}
        {editing && (
          <form onSubmit={handleSaveEdit} style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <strong>Edit:</strong> {editing.id}
            <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                   required style={{ padding: 8, minWidth: 300 }} />
            <button type="submit" disabled={savingEdit} style={{ padding: "6px 10px" }}>
              {savingEdit ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} style={{ padding: "6px 10px" }}>Cancel</button>
          </form>
        )}

        {/* Assign projects */}
        {selectedInvestor && (
          <div style={{ marginTop: 24 }}>
            <h4>Assign projects to {selectedInvestor.email}</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {projects.map((p) => (
                <li key={p.id} style={{ padding: "6px 0" }}>
                  <label>
                    <input type="checkbox" checked={assignments.includes(p.id)}
                           onChange={() => toggleAssignment(p.id)} disabled={busy} /> {p.name}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedInvestor(null)} style={{ marginTop: 8, padding: "6px 10px" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </>
  );
}
