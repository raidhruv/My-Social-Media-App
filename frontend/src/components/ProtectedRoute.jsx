import { Navigate } from "react-router-dom";
import { useCurrentUserContext } from "../context/CurrentUserContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useCurrentUserContext();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;