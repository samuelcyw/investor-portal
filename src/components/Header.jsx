import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) setIsAdmin(true);
    }
    checkAdmin();
  }, []);

  return (
    <header
      style={{
        background: "#06023a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        height: 56,
        borderBottom: "1px solid #181439"
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img
          src="https://www.theregency.ca/img/logo2.svg"
          alt="Regency Logo"
          style={{ height: 32, marginRight: 14 }}
        />
      </Link>

      {isAdmin && (
        <Link
          to="/admin-assign"
          style={{
            color: "white",
            textDecoration: "none",
            background: "#167164",
            padding: "6px 14px",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          Admin Page
        </Link>
      )}
    </header>
  );
}
