import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [userFilter, setUserFilter] = useState({
    name: "",
    email: "",
    address: "",
    role: ""
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER"
  });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: ""
  });


  const loadDashboard = async () => {
    const statsRes = await api.get("/admin/dashboard");
    const usersRes = await api.get("/admin/users");
    const storesRes = await api.get("/admin/stores");

    setStats(statsRes.data);
    setUsers(usersRes.data);
    setStores(storesRes.data);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const addUser = async () => {
    await api.post("/admin/users", newUser);
    alert("User added");
    loadDashboard();
  };

  const addStore = async () => {
    await api.post("/admin/stores", newStore);
    alert("Store added");
    loadDashboard();
  };


  const applyUserFilter = async () => {
    const res = await api.get("/admin/users", { params: userFilter });
    setUsers(res.data);
  };

  const viewUser = async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    setSelectedUser(res.data);
  };


  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div>
        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Stores: {stats.totalStores}</p>
        <p>Total Ratings: {stats.totalRatings}</p>
      </div>

      <hr />

      <h2>Add User</h2>
      <input placeholder="Name" onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
      <input placeholder="Password" type="password"
        onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
      <input placeholder="Address" onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
      <select onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button onClick={addUser}>Add User</button>

      <hr />

      <h2>Add Store</h2>
      <input placeholder="Store Name" onChange={e => setNewStore({ ...newStore, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setNewStore({ ...newStore, email: e.target.value })} />
      <input placeholder="Address" onChange={e => setNewStore({ ...newStore, address: e.target.value })} />
      <button onClick={addStore}>Add Store</button>

      <hr />


      <h2>Users</h2>
      <input placeholder="Filter Name" onChange={e => setUserFilter({ ...userFilter, name: e.target.value })} />
      <input placeholder="Filter Email" onChange={e => setUserFilter({ ...userFilter, email: e.target.value })} />
      <input placeholder="Filter Address" onChange={e => setUserFilter({ ...userFilter, address: e.target.value })} />
      <select onChange={e => setUserFilter({ ...userFilter, role: e.target.value })}>
        <option value="">All</option>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
        <option value="OWNER">OWNER</option>
      </select>
      <button onClick={applyUserFilter}>Apply Filter</button>

      {users.map(u => (
        <div key={u.id}>
          {u.name} - {u.email} - {u.role}
          <button onClick={() => viewUser(u.id)}>View</button>
        </div>
      ))}


      {selectedUser && (
        <div style={{ border: "1px solid gray", marginTop: "10px", padding: "10px" }}>
          <h4>User Details</h4>
          <p>Name: {selectedUser.name}</p>
          <p>Email: {selectedUser.email}</p>
          <p>Address: {selectedUser.address}</p>
          <p>Role: {selectedUser.role}</p>
          {selectedUser.storeRating !== undefined && (
            <p>Store Rating: {selectedUser.storeRating}</p>
          )}
        </div>
      )}

      <hr />

      <h2>Stores</h2>
      {stores.map((s, i) => (
        <div key={i}>
          {s.name} - {s.email} - {s.address} - Rating: {s.rating}
        </div>
      ))}

      <hr />

      <button onClick={logout}>Logout</button>
    </div>
  );
}
