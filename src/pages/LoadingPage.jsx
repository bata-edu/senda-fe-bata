import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/Animation - 1728482019569.json';

const LoadingPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="loading-page">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default LoadingPage;
