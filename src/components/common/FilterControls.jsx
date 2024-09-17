import React from 'react';
import './commonStyles/FilterControls.css';

const FilterControls = ({ timeFrame, setTimeFrame, type, setType, typeOptions }) => {
  return (
    <div className="filter-controls">
      <select id="timeFrame" value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
      <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="all">All</option>
        {typeOptions.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterControls;
