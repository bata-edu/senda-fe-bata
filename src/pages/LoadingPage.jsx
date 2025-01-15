import React from "react";
import Loading from "../assets//loading.gif";

const LoadingPage = () => {
  return (
    <div className="mx-auto">
      <img className="w-48" src={Loading} />
    </div>
  );
};

export default LoadingPage;
