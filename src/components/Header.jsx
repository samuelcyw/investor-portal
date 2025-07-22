import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{
      background: "#06023a",
      display: "flex",
      alignItems: "center",
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
        {/* Remove this: */}
        {/* <span style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "serif",
          letterSpacing: 2
        }}>
          REGENCY
        </span> */}
      </Link>
    </header>
  );
}
