import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [ratings, setRatings] = useState({});

  const loadStores = async () => {
    const res = await api.get("/user/stores", { params: filters });
    setStores(res.data);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const submitRating = async (storeId) => {
    if (!ratings[storeId]) {
      alert("Please select a rating");
      return;
    }

    await api.post(`/ratings/${storeId}`, {
      rating: ratings[storeId]
    });

    alert("Rating submitted");
    loadStores();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stores</h2>

      <input
        placeholder="Search by Name"
        onChange={e => setFilters({ ...filters, name: e.target.value })}
      />
      <input
        placeholder="Search by Address"
        onChange={e => setFilters({ ...filters, address: e.target.value })}
      />
      <button onClick={loadStores}>Search</button>

      <hr />

      {stores.map(store => (
        <div key={store.id} style={{ marginBottom: "15px" }}>
          <strong>{store.name}</strong><br />
          {store.address}<br />
          Avg Rating: {store.rating}<br />

          <select
            onChange={e =>
              setRatings({ ...ratings, [store.id]: e.target.value })
            }
          >
            <option value="">Rate</option>
            {[1, 2, 3, 4, 5].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <button onClick={() => submitRating(store.id)}>
            Submit Rating
          </button>

          <hr />
        </div>
      ))}

      <button onClick={logout}>Logout</button>
    </div>
  );
}
