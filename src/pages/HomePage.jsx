import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function HomePage() {
  const bgImage =
    "https://www.dropbox.com/scl/fi/2cakary1eo1oo5t9w2v5r/10f0f8fb-ce2d-49cf-9adf-823e6864d64b.png?rlkey=dy3as4hu7gr77p5c62fh0y6lt&st=pqh63tzr&raw=1";

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "calc(100vh - 88px)",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          background: `url(${bgImage}) center center/cover no-repeat`,
          position: "relative",
          fontFamily: "Inter, Arial, sans-serif"
        }}
      >
        <div
          className="home-card"
          style={{
            background: "rgba(255,255,255,0.82)",
            padding: "3rem 2rem",
            marginLeft: "5vw",
            maxWidth: 540,
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            minWidth: 280,
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.7rem",
              fontWeight: 900,
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            Empowering Your Investment
            <br />
            Journey
          </h1>
          <p
            style={{
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 18,
              marginBottom: 32,
              color: "#222",
              fontWeight: 500,
            }}
          >
            Unlock exclusive insights and track your investments effortlessly
          </p>
          <Link to="/login">
            <button
              style={{
                background: "#167164",
                color: "#fff",
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: 20,
                padding: "12px 32px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 700,
                boxShadow: "0 4px 16px rgba(22,113,100,0.13)",
              }}
            >
              Log in
            </button>
          </Link>
        </div>
      </div>
      <style>
        {`
        @media (max-width: 900px) {
          .home-card {
            margin-left: 2vw !important;
            padding: 2rem 1rem !important;
            max-width: 95vw !important;
          }
        }
        @media (max-width: 600px) {
          .home-card {
            margin-left: 0 !important;
            padding: 1rem 0.5rem !important;
            border-radius: 6px !important;
            min-width: unset !important;
          }
        }
        `}
      </style>
    </>
  );
}
