import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncomesAsync } from '../../redux/slices/incomeSlice';
import { getDateRange } from '../../utils/dateUtils';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend, Colors } from 'chart.js';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';
import './incomeStyles/IncomeDashboard.css';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

const IncomeDashboard = () => {
  const dispatch = useDispatch();
  const { loading, error, incomes } = useSelector((state) => state.income);

  const [timeFrame, setTimeFrame] = useState('week');
  const [incomeType, setIncomeType] = useState('all');
  const [currentRange, setCurrentRange] = useState(getDateRange('week'));

  useEffect(() => {
    dispatch(fetchIncomesAsync());
  }, [dispatch]);

  // Update the current range whenever the time frame changes
  useEffect(() => {
    setCurrentRange(getDateRange(timeFrame));
  }, [timeFrame]);

  // Function to adjust the date range when navigating
  const navigatePeriod = (direction) => {
    const adjustment = direction === 'next' ? 1 : -1;
    const referenceDate = new Date(currentRange.startDate);

    if (timeFrame === 'week') {
      referenceDate.setDate(referenceDate.getDate() + adjustment * 7);
    } else if (timeFrame === 'month') {
      referenceDate.setMonth(referenceDate.getMonth() + adjustment);
    } else if (timeFrame === 'year') {
      referenceDate.setFullYear(referenceDate.getFullYear() + adjustment);
    }

    setCurrentRange(getDateRange(timeFrame, referenceDate));
  };

  // Helper function to format the date to dd.mm.yyyy
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Filter data based on time frame and income type
  const filteredData = incomes.filter((income) => {
    const incomeDate = new Date(income.added_at);
    const withinDateRange = incomeDate >= currentRange.startDate && incomeDate <= currentRange.endDate;
    const matchesType = incomeType === 'all' || income.type === incomeType;
    return withinDateRange && matchesType;
  });

  // Data for Pie Chart
  const incomeSummary = filteredData.reduce(
    (acc, income) => {
      acc[income.type] += parseFloat(income.amount);
      return acc;
    },
    { salary: 0, passive: 0 }
  );

  const totalIncome = incomeSummary.salary + incomeSummary.passive;

  const pieChartData = {
    labels: ['Salary', 'Passive Income'],
    datasets: [
      {
        data: [
          totalIncome > 0 ? ((incomeSummary.salary / totalIncome) * 100).toFixed(2) : 0,
          totalIncome > 0 ? ((incomeSummary.passive / totalIncome) * 100).toFixed(2) : 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  // Data for Bar Chart
  const generateBarChartLabels = () => {
    const labels = [];
    if (timeFrame === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentRange.startDate);
        date.setDate(currentRange.startDate.getDate() + i);
        labels.push(days[i] + ' ' + date.getDate());
      }
    } else if (timeFrame === 'month') {
      const daysInMonth = new Date(currentRange.startDate.getFullYear(), currentRange.startDate.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(i.toString());
      }
    } else if (timeFrame === 'year') {
      labels.push('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    }
    return labels;
  };

  const labels = generateBarChartLabels();

  const salaryAmounts = labels.map((label, index) => {
    const date = new Date(currentRange.startDate);
    if (timeFrame === 'week') {
      date.setDate(currentRange.startDate.getDate() + index);
    } else if (timeFrame === 'month') {
      date.setDate(index + 1);
    } else if (timeFrame === 'year') {
      date.setMonth(index);
    }

    const income = filteredData.find((income) => {
      if (income.type !== 'salary') return false;
      if (timeFrame === 'year') {
        return new Date(income.added_at).getMonth() === date.getMonth();
      }
      return new Date(income.added_at).toLocaleDateString() === date.toLocaleDateString();
    });

    return income ? parseFloat(income.amount) : 0;
  });

  const passiveAmounts = labels.map((label, index) => {
    const date = new Date(currentRange.startDate);
    if (timeFrame === 'week') {
      date.setDate(currentRange.startDate.getDate() + index);
    } else if (timeFrame === 'month') {
      date.setDate(index + 1);
    } else if (timeFrame === 'year') {
      date.setMonth(index);
    }

    const income = filteredData.find((income) => {
      if (income.type !== 'passive') return false;
      if (timeFrame === 'year') {
        return new Date(income.added_at).getMonth() === date.getMonth();
      }
      return new Date(income.added_at).toLocaleDateString() === date.toLocaleDateString();
    });

    return income ? parseFloat(income.amount) : 0;
  });

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Salary',
        data: salaryAmounts,
        backgroundColor: '#FF6384',
      },
      {
        label: 'Passive Income',
        data: passiveAmounts,
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const barChartOptions = {
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Amount: $${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: 'Amount',
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
        
      },
    },
  };

  return (
    <div className="income-dashboard">
      <h2>Income Overview</h2>
      <div className="income-filters">
        <div className="navigation-controls">
          <button onClick={() => navigatePeriod('prev')} style={{ backgroundColor: '#FF6384' }}>
            <IoIosArrowBack />
          </button>
          <span>
            {formatDate(currentRange.startDate)} - {formatDate(currentRange.endDate)}
          </span>
          <button onClick={() => navigatePeriod('next')} style={{ backgroundColor: '#36A2EB' }}>
            <IoIosArrowForward />
          </button>
        </div>
        <div className="filter-controls">
          <select id="timeFrame" value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          <select id="incomeType" value={incomeType} onChange={(e) => setIncomeType(e.target.value)}>
            <option value="all">All</option>
            <option value="salary">Salary</option>
            <option value="passive">Passive Income</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="charts-container">
        <div className="pie-chart-card">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>

        <div className="bar-chart-card">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default IncomeDashboard;
