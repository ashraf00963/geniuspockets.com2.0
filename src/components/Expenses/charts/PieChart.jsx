import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = ({ data }) => {
  // Calculate total expenses
  const totalExpenses = Object.values(data).reduce((sum, value) => sum + value, 0);

  // Calculate percentages and apply rounding to the nearest 5%
  const percentages = Object.values(data).map(value => (value / totalExpenses) * 100);
  const roundedPercentages = percentages.map(percentage => Math.round(percentage * 2) / 2); // Rounds to nearest 0.5%
  
  // Adjust to ensure the total is 100%
  const roundedTotal = roundedPercentages.reduce((sum, percentage) => sum + percentage, 0);
  const difference = 100 - roundedTotal;

  if (difference !== 0) {
    const indexToAdjust = roundedPercentages.indexOf(Math.max(...roundedPercentages));
    roundedPercentages[indexToAdjust] += difference;
  }

  const pieChartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: roundedPercentages,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
        ],
        borderColor: 'transparent',
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const percentage = context.raw || 0;
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '210px' }}>
      <Pie data={pieChartData} options={pieChartOptions} />
    </div>
  );
};

export default PieChart;
