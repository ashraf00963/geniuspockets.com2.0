import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ pieChartData, pieChartOptions, totalIncome, incomeSummary }) => {
  return (
    <div className="pie-chart-card">
      <div className='pie-chart-percentage'>
        <p>Salary: <span style={{ color: '#36A2EB'}}>{totalIncome > 0 ? ((incomeSummary.salary / totalIncome) * 100).toFixed(2) : 0}%</span></p>
        <p>Passive: <span style={{ color: '#FF6384'}}>{totalIncome > 0 ? ((incomeSummary.passive / totalIncome) * 100).toFixed(2) : 0}%</span></p>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '210px' }}>
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </div>
  );
};

export default PieChart;