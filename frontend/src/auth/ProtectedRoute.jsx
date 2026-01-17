import { Navigate } from "react-router-dom";
import { isLoggedIn, getRole } from "./auth";

export default function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) return <Navigate to="/login" />;

  if (role && role !== getRole()) {
    return <Navigate to="/login" />;
  }

  return children;
}
