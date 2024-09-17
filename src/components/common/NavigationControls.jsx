import React from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import './commonStyles/NavigationControls.css';

const NavigationControls = ({ navigatePeriod, currentRange, formatDateToGerman }) => {
  return (
    <div className="navigation-controls">
      <button onClick={() => navigatePeriod('prev')} style={{ backgroundColor: '#FF6384' }}>
        <IoIosArrowBack />
      </button>
      <span>
        {formatDateToGerman(currentRange.startDate)} - {formatDateToGerman(currentRange.endDate)}
      </span>
      <button onClick={() => navigatePeriod('next')} style={{ backgroundColor: '#36A2EB' }}>
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default NavigationControls;
