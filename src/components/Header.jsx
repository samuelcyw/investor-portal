import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  // Only show Admin button on project list & detail pages
  const onProjectPages =
    location.pathname === "/projects" ||
    location.pathname.startsWith("/projects/");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) { setIsAdmin(false); return; }
      const { data, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .single();
      if (!mounted) return;
      setIsAdmin(Boolean(data) && !error);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <header style={{
      background: "#06023a",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 32px",
      height: 56,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
      borderBottom: "1px solid #181439"
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img
          src="https://www.theregency.ca/img/logo2.svg"
          alt="Regency Logo"
          style={{ height: 32, marginRight: 14 }}
        />
      </Link>

      {isAdmin && onProjectPages && (
        <Link
          to="/admin-users"   // <-- correct route
          style={{
            color: "white",
            textDecoration: "none",
            background: "#167164",
            padding: "6px 14px",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          Admin
        </Link>
      )}
    </header>
  );
}
