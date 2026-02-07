import { Navigate, Outlet, useLocation } from "react-router";
import { JWT_TOKEN_KEY } from "../api/axiosInstance";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem(JWT_TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
