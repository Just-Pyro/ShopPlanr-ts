import React from "react";

interface MainWrapperProp {
  children: React.ReactNode;
  backdrop: boolean;
}

const MainWrapper = ({ children, backdrop = false }: MainWrapperProp) => {
  return (
    <>
      {backdrop && (
        <div className="absolute top-0 left-0 z-10 bg-black/50 w-full h-full"></div>
      )}
      <div className={`main-content-wrapper`}>{children}</div>
    </>
  );
};

export default MainWrapper;
