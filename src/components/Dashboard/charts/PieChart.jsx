import { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './chartsStyles/Charts.css';

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ totalIncome, totalExpenses }) => {
  if (totalIncome === 0 && totalExpenses === 0) {
    return <p>No data available for the pie chart.</p>;
  }

  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#36a2eb', '#ff6384'],
        hoverBackgroundColor: ['#0090f0', '#fd4870'],
        borderColor: 'transparent',
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: false,
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw;
            const total = totalIncome + totalExpenses;
            const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
            return `${label}: ${value.toLocaleString('en-US')} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Format the total balance using European number formatting
  const EuroFormat = (m) => {
    const fixedM = m.toFixed(2)
    const result = new Intl.NumberFormat('de-DE').format(fixedM ?? 0);
    return result;
  }

  return (
    <div className='charts-pie-chart'>
      <div className='charts-pie-data'>
        <p className='dashboard-income-p'>Income: <span id='dashboard-totalincome'>{EuroFormat(totalIncome)}€</span></p>
        <p className='dashboard-expenses-p'>Expenses: <span id='dashboard-totalexpenses'>{EuroFormat(totalExpenses)}€</span></p>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '210px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
