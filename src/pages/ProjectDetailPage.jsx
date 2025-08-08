import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Header from "../components/Header";
import "./ProjectListPage.css";

const bgImage =
  "https://www.dropbox.com/scl/fi/2cakary1eo1oo5t9w2v5r/10f0f8fb-ce2d-49cf-9adf-823e6864d64b.png?rlkey=dy3as4hu7gr77p5c62fh0y6lt&st=pqh63tzr&raw=1";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError("");
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

  // Admin check
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); return; }
      const { data } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .single();
      setIsAdmin(!!data);
    })();
  }, []);

  if (loading)
    return (
      <>
        <Header />
        <div style={{ padding: 40 }}>Loading...</div>
      </>
    );
  if (error)
    return (
      <>
        <Header />
        <div style={{ padding: 40, color: "red" }}>{error}</div>
      </>
    );
  if (!project)
    return (
      <>
        <Header />
        <div style={{ padding: 40 }}>Project not found.</div>
      </>
    );

  return (
    <>
      <Header />
      <div
        className="project-bg-root"
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: `url(${bgImage}) center center/cover no-repeat`,
          fontFamily: "Inter, Arial, sans-serif",
          overflowX: "hidden",
        }}
      >
        <div className="main-content">
          <div
            className="projects-hero-card"
            style={{ maxWidth: 600, margin: "36px auto 0 auto" }}
          >
            {isAdmin && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <Link
                  to="/admin-users"
                  style={{
                    background: "#167164",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: 6,
                    textDecoration: "none",
                    fontWeight: 700
                  }}
                >
                  Admin
                </Link>
              </div>
            )}

            {/* Project Image */}
            {project.image_url && (
              <div
                style={{
                  width: "100%",
                  height: 220,
                  marginBottom: 20,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#f4f4f4",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)"
                }}
              >
                <img
                  src={project.image_url}
                  alt={project.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}
            <h2 style={{ marginBottom: 12 }}>{project.name}</h2>
            {project.location && (
              <div style={{ marginBottom: 8, color: "#666", fontWeight: 500 }}>
                <span style={{ fontWeight: 600 }}>Location:</span> {project.location}
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <strong>Status:</strong> {project.status || "N/A"}
            </div>
            <div style={{ margin: "1em 0", color: "#444" }}>
              {project.description}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
