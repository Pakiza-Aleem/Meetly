import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Wraps any page that requires authentication; sends guests to /login
export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
