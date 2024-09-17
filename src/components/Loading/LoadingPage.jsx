import React, { useEffect, useState } from 'react';
import './LoadingStyles/LoadingPage.css';
import logo from '../../assets/gpLogo.webp';

const LoadingPage = ({ progress }) => {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    let interval;

    if (progress) {
      interval = setInterval(() => {
        setProgressWidth((prev) => {
          const nextWidth = prev + 10; // Increase progress by 10% increments
          return nextWidth >= 100 ? 100 : nextWidth;
        });
      }, 200); // Adjust the speed of the loading bar
    }

    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    if (!progress && progressWidth < 100) {
      // Complete the progress bar if loading finishes before bar is full
      setProgressWidth(100);
    }
  }, [progress, progressWidth]);

  return (
    <div className="loading-page">
      <img src={logo} alt="Loading Logo" className="loading-logo" />
      <div className="loader">
        <div
          className="loader-progress"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingPage;
