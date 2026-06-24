import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = location.pathname.startsWith("/teacher")
      ? "/teacher/login"
      : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const defaultPath = role === "teacher" ? "/teacher/dashboard" : "/";
    return <Navigate to={defaultPath} replace />;
  }


  return children;
};

export default ProtectedRoute;
