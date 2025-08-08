import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Header() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setChecking(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        setIsAdmin(false);
        setUserEmail("");
        setChecking(false);
        return;
      }

      setUserEmail(user.email || "");
      const { data, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (!mounted) return;
      setIsAdmin(Boolean(data) && !error);
      setChecking(false);
    })();

    return () => { mounted = false; };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <header
      style={{
        background: "#06023a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        height: 56,
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
        borderBottom: "1px solid #181439",
        color: "#fff",
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img
          src="https://www.theregency.ca/img/logo2.svg"
          alt="Regency Logo"
          style={{ height: 32, marginRight: 14 }}
        />
      </Link>

      {/* Right side actions */}
      <nav style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Optional: general link visible to signed-in users */}
        <Link to="/projects" style={{ color: "#cfe8ff", textDecoration: "none", fontWeight: 600 }}>
          Projects
        </Link>

        {!checking && isAdmin && (
          <Link
            to="/admin-users"
            style={{
              background: "#167164",
              color: "#fff",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 6,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(22,113,100,0.2)"
            }}
          >
            Admin
          </Link>
        )}

        {!checking && userEmail ? (
          <>
            <span style={{ opacity: 0.85, fontSize: 14 }}>{userEmail}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid #3b3b6b",
                color: "#cfd3ff",
                padding: "6px 10px",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          !checking && (
            <Link
              to="/login"
              style={{ color: "#cfe8ff", textDecoration: "none", fontWeight: 600 }}
            >
              Login
            </Link>
          )
        )}
      </nav>
    </header>
  );
}
