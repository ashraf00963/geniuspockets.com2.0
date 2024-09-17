import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from 'chart.js';

// Register the necessary components for the chart
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

const LineChart = ({ incomeData, expenseData }) => {
  // Prepare the data for the chart
  const data = {
    labels: incomeData.map((_, index) => `Point ${index + 1}`), // Generic labels since we're hiding them
    datasets: [
      {
        label: 'Income',
        data: incomeData.map((income) => parseFloat(income.amount)),
        borderColor: '#36a2eb',
        borderWidth: 2,
        tension: 0, // Smooth curve
        fill: true, // Fill the area under the line
        backgroundColor: 'rgba(54, 162, 235, 0.1)', // Light green glassy effect
        pointRadius: 2, // Hide points
      },
      {
        label: 'Expenses',
        data: expenseData.map((expense) => parseFloat(expense.amount)),
        borderColor: '#ff6384',
        borderWidth: 2,
        tension: 0, // Smooth curve
        fill: true, // Fill the area under the line
        backgroundColor: 'rgba(255, 99, 132, 0.1)', // Light red glassy effect
        pointRadius: 1, // Hide points
      },
    ],
  };

  // Configure the options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false, // Hide x-axis
      },
      y: {
        display: true, // Hide y-axis
        grid: {
            display: true,
            color: '#ccc',
        },
        ticks: {
            color: 'white',
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        enabled: true, // Ensure tooltips are enabled
        callbacks: {
          label: function (context) {
            // Customize the tooltip label
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
              }).format(context.raw);
            }
            return label;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Curved lines
      },
    },
  };

  return (
    <div className='charts-line-chart'>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
