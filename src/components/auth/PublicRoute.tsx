import React from "react";
import { Navigate } from "react-router-dom";

interface ChildrenType {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: ChildrenType) => {
  const isAuth = localStorage.getItem("user");

  if (isAuth) {
    return <Navigate to="/list" replace />;
  }

  return children;
};

export default PublicRoute;
