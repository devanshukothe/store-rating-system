import { useState } from "react";
import api from "../../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
    adminKey: ""
  });

  const submit = async () => {
    try {
      await api.post("/auth/signup", form);
      alert("Registration successful");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>Register</h1>

      <input
        placeholder="Full Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Address"
        onChange={e => setForm({ ...form, address: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <select
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">Normal User</option>
        <option value="OWNER">Store Owner</option>
        <option value="ADMIN">Admin</option>
      </select>

      {form.role === "ADMIN" && (
        <input
          placeholder="Admin Secret Key"
          onChange={e => setForm({ ...form, adminKey: e.target.value })}
        />
      )}

      <button onClick={submit}>Register</button>
    </div>
  );
}
