import type React from "react";
import { Navigate } from "react-router-dom";

interface ChildrenType {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ChildrenType) => {
  const isAuth = localStorage.getItem("user");

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
