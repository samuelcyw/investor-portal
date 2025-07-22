import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError("");

      // Fetch project by slug
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        setError(error.message);
        setProject(null);
      } else {
        setProject(data);
      }
      setLoading(false);
    }
    fetchProject();
  }, [slug]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (!project) return <div style={{ padding: 40 }}>Project not found.</div>;

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h2>{project.name}</h2>
      <div><strong>Status:</strong> {project.status || "N/A"}</div>
      <div style={{ margin: "1em 0" }}>{project.description}</div>
      {/* Add more fields as needed */}
    </div>
  );
}
