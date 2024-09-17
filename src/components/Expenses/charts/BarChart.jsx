import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarChart = ({ labels, datasets }) => {
  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Amount: €${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        ticks: {
          color: '#ddd',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return value + '€';
          },
          color: '#ddd',
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '250px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
