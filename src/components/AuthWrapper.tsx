import React from "react";

interface ChildrenType {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: ChildrenType) => {
  return <div className="auth-wrapper">{children}</div>;
};

export default AuthWrapper;
