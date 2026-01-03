import { Navigate } from "react-router-dom";
import { getToken } from "./authStorage";

export default function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
