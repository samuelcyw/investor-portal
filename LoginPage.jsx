import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Header from "../components/Header";

const bgImage =
  "https://www.dropbox.com/scl/fi/2cakary1eo1oo5t9w2v5r/10f0f8fb-ce2d-49cf-9adf-823e6864d64b.png?rlkey=dy3as4hu7gr77p5c62fh0y6lt&st=pqh63tzr&raw=1";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate("/projects");
  }

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "calc(100vh - 88px)",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `url(${bgImage}) center center/cover no-repeat`,
          position: "relative",
          fontFamily: "Inter, Arial, sans-serif"
        }}
      >
        <div
          className="login-card"
          style={{
            background: "rgba(255,255,255,0.92)",
            padding: "2.5rem 2rem",
            maxWidth: 360,
            width: "100%",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
          }}
        >
          <h2
  style={{
    fontFamily: "'Montserrat', Inter, Arial, sans-serif",
    fontWeight: 700,
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: "0.01em",
  }}
>
  Login
</h2>
          {error && (
            <div style={{ color: "#be123c", marginBottom: 10, fontWeight: 600 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 10px",
                marginBottom: 14,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 16,
                fontFamily: "Inter, Arial, sans-serif"
              }}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 10px",
                marginBottom: 18,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 16,
                fontFamily: "Inter, Arial, sans-serif"
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px",
                width: "100%",
                background: "#167164",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 6,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(22,113,100,0.13)"
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
      {/* Responsive styles */}
      <style>
        {`
        @media (max-width: 600px) {
          .login-card {
            max-width: 97vw !important;
            padding: 1.5rem 0.5rem !important;
          }
        }
        `}
      </style>
    </>
  );
}
