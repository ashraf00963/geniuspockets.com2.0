import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ barChartData, barChartOptions }) => {
  return (
    <div className="bar-chart-card">
      <Bar data={barChartData} options={barChartOptions} style={{ width: '100%', height: '250px'}}/>
    </div>
  );
};

export default BarChart;

