import React, { useEffect, useState } from 'react';
import './LoadingStyles/LoadingOverlay.css';
import logo from '../../assets/gpLogo.webp';

const LoadingOverlay = ({ onLoadingComplete }) => {
  const [barCompleted, setBarCompleted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBarCompleted(true);
    }, 1000); // This matches the 3s duration of the progress bar animation

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (barCompleted) {
      onLoadingComplete();
    }
  }, [barCompleted, onLoadingComplete]);

  return (
    <div className="loading-overlay">
      <img src={logo} alt="Loading Logo" className="loading-logo" />
      <div className="loader">
        <div
          className="loader-progress"
          style={{ width: barCompleted ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;
