import { useEffect, useState } from "react";
import { supabase } from "../supabase";  // Make sure this import is correct
import Header from "../components/Header";

export default function AdminUserManagerPage() {
  const [investors, setInvestors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInvestors() {
      const { data, error } = await supabase
        .from("investors")
        .select("id, email");
      if (error) {
        setError(error.message);
        setInvestors([]);
      } else {
        setInvestors(data || []);
        setError(null);
      }
    }
    fetchInvestors();
  }, []);

  return (
    <>
      <Header />
      <div>
        <h1>Investor Users</h1>
        {error && <p>Error: {error}</p>}
        <ul>
          {investors.map((inv) => (
            <li key={inv.id}>{inv.email}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
