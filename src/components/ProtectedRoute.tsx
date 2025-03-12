import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth?.user && location.pathname !== "/login" && location.pathname !== "/register") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
