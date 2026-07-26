import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../zustand/useAuthStore";

const OpenRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default OpenRoute;