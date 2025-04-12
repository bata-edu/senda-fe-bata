import React from "react";
import Loading from "../assets//loading.gif";

export const LoaderCSS = ({width, height, className}) => {
  return (
      <div className={`flex items-center justify-center bg-background ${className}`}>
          <svg className="svg-animation" width={width} height={height} viewBox="0 0 173 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="path1" fillRule="evenodd" clipRule="evenodd" d="M35.911 63.9981L76.3822 40.745V0L0.455933 43.6275L35.911 63.9981Z" fill="#D9B9F3" />
              <path className="path2" fillRule="evenodd" clipRule="evenodd" d="M137.089 63.9981L96.6178 40.745V0L172.544 43.6275L137.089 63.9981Z" fill="#EE5E37" />
              <path className="path3" fillRule="evenodd" clipRule="evenodd" d="M137.089 63.9981L96.6178 87.2511V127.996L172.544 84.3687L137.089 63.9981Z" fill="#E0F47E" />
              <path className="path4" fillRule="evenodd" clipRule="evenodd" d="M35.911 63.9981L76.3822 87.2511V127.996L0.455933 84.3687L35.911 63.9981Z" fill="#4558C8" />
          </svg>
      </div>
    );
}

const LoadingPage = ({message}) => {
  return (
    <div className="mx-auto h-full flex flex-col justify-center">
      <img className="w-48 mx-auto" src={Loading} alt="Loading..." />
      {message && <p className="font-mono text-lg text-center w-full">{message}</p>}
    </div>
  );
};

export const LoadingFullScreen = ({message, backgroundColor}) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center" style={{backgroundColor}}>
      <img className="w-48" src={Loading} alt="Loading..." />
      {message && <p className="text-center w-full">{message}</p>}
    </div>
  );
};

export default LoadingPage;
