import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/authPages/Login";
import Register from "./components/authPages/Register";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/userPages/UserDashboard";
import OwnerDashboard from "./components/ownerPages/OwnerDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />



        <Route
          path="/owner"
          element={
            <ProtectedRoute role="OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
