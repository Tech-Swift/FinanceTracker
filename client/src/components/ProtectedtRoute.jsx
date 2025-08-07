import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // If not logged in, redirect to homepage or show login modal
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
