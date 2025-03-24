import React from "react";
import Loading from "../assets//loading.gif";

const LoadingPage = ({message}) => {
  return (
    <div className="mx-auto h-full flex flex-col justify-center">
      <img className="w-48 mx-auto" src={Loading} alt="Loading..." />
      {message && <p className="font-mono text-lg text-center w-full">{message}</p>}
    </div>
  );
};

export const LoadingFullScreen = ({message}) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <img className="w-48" src={Loading} alt="Loading..." />
      {message && <p className="text-center w-full">{message}</p>}
    </div>
  );
};

export default LoadingPage;
