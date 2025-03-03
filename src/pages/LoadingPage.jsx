import React from "react";
import Loading from "../assets//loading.gif";

const LoadingPage = () => {
  return (
    <div className="mx-auto">
      <img className="w-48 mx-auto" src={Loading} alt="Loading..." />
    </div>
  );
};

export const LoadingFullScreen = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <img className="w-48" src={Loading} alt="Loading..." />
    </div>
  );
};

export default LoadingPage;
