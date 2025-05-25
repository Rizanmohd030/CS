import React from 'react';
import './LoadingScreen.module.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading Construction Data...</p>
    </div>
  );
};

export default LoadingScreen;