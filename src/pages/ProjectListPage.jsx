import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./ProjectListPage.css";

const bgImage =
  "https://www.dropbox.com/scl/fi/2cakary1eo1oo5t9w2v5r/10f0f8fb-ce2d-49cf-9adf-823e6864d64b.png?rlkey=dy3as4hu7gr77p5c62fh0y6lt&st=pqh63tzr&raw=1";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError("");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      setUser(user);

      if (userError || !user) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }
      const { data, error: assignError } = await supabase
        .from("investor_projects")
        .select("project_id, projects:project_id (*)")
        .eq("investor_id", user.id);

      if (assignError) {
        setError(assignError.message);
        setLoading(false);
        return;
      }
      setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Investor";

  if (loading)
    return (
      <>
        <Header />
        <div style={{ padding: 40, color: "#222" }}>Loading...</div>
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div style={{ padding: 40, color: "red" }}>{error}</div>
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
          overflowX: "hidden"
        }}
      >
        <div className="main-content">
          {/* Hero Section */}
          <div className="projects-hero-card">
            <h1 className="hero-headline">Welcome back,</h1>
            <h1 className="hero-name">{displayName}!</h1>
            <div className="hero-caption">
              View detailed financial data for your assigned projects only
            </div>
            )}
          </div>

          {/* Projects List Section */}
          <div className="projects-list-container">
            <h2 className="projects-title">Your Projects</h2>
            {projects.length === 0 ? (
              <div>No projects assigned.</div>
            ) : (
              <div className="projects-grid">
                {projects.map((row, idx) => {
                  const project = row.projects || {};
                  return (
                    <div className="project-vertical-card" key={row.project_id || idx}>
                      <div className="project-image-wrap">
                        {project.slug ? (
                          <Link to={`/projects/${project.slug}`}>
                            <img
                              src={project.image_url}
                              alt={project.name}
                              className="project-image"
                              style={{ cursor: "pointer" }}
                            />
                          </Link>
                        ) : (
                          <img
                            src={project.image_url}
                            alt={project.name}
                            className="project-image"
                          />
                        )}
                      </div>
                      <div className="project-card-body">
                        {project.location && (
                          <div className="project-location">{project.location}</div>
                        )}
                        <div className="project-name">
                          {project.slug ? (
                            <Link to={`/projects/${project.slug}`} style={{ color: "#167164", textDecoration: "none" }}>
                              {project.name || "Unnamed Project"}
                            </Link>
                          ) : (
                            project.name || "Unnamed Project"
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
