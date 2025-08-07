import { useEffect, useState } from 'react';
import Header from '../components/Header';

export default function AdminUserManagerPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin-users/list')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        setUsers(data.users || []);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <>
      <Header />
      <div>
        <h1>Admin Users</h1>
        {error && <p>Error: {error}</p>}
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.email}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
