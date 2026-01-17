import { useEffect, useState } from "react";
import api from "../../api/axios";
import UpdateOwnerPassword from "./UpdateOwnerPassword";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/owner/dashboard")
      .then(res => setData(res.data))
      .catch(() => alert("Failed to load dashboard"));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Store Owner Dashboard</h2>

      <h3>Store: {data.storeName}</h3>
      <p>Average Rating: {data.averageRating}</p>

      <hr />

      <h3>Users Who Rated</h3>
      {data.ratedByUsers.length === 0 && <p>No ratings yet</p>}

      {data.ratedByUsers.map((u, i) => (
        <div key={i}>
          {u.name} ({u.email}) — Rating: {u.rating}
        </div>
      ))}
      <hr />
      <button onClick={() => window.location.href="/owner/update-password"}>
        Update Password
      </button>
      <UpdateOwnerPassword />
      <br /><br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
