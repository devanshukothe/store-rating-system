import { useState } from "react";
import api from "../../api/axios";

export default function UpdateOwnerPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updatePassword = async () => {
    try {
      await api.put("/owner/update-password", {
        oldPassword,
        newPassword,
      });
      alert("Password updated");
      window.location.href = "/owner";
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Password</h2>

      <input
        type="password"
        placeholder="Old Password"
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={updatePassword}>Update</button>
    </div>
  );
}
