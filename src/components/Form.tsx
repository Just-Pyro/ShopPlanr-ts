import React from "react";

interface ChildrenType {
  children: React.ReactNode;
}

const Form = ({ children }: ChildrenType) => {
  return <form className="logreg-form">{children}</form>;
};

export default Form;
