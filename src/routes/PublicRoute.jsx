import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicRoute({ children }) {
  const { authToken } = useAuth();

  return !authToken ? children : <Navigate to="/main" replace />;
}
