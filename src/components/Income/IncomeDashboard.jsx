import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchIncomesAsync } from '../../redux/slices/incomeSlice';
import { getDateRange } from '../../utils/dateUtils';
import { generateBarChartLabels, aggregateData } from '../../utils/chartUtils';
import { formatDateToGerman } from '../../utils/formatUtils';
import NavigationControls from '../common/NavigationControls';
import FilterControls from '../common/FilterControls';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import './incomeStyles/IncomeDashboard.css';

const IncomeDashboard = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation('incomePage');
    const { loading, error, incomes } = useSelector((state) => state.income);

    const [timeFrame, setTimeFrame] = useState('week');
    const [incomeType, setIncomeType] = useState('all');
    const [currentRange, setCurrentRange] = useState(getDateRange('week'));

    useEffect(() => {
        dispatch(fetchIncomesAsync());
    }, [dispatch]);

    useEffect(() => {
        setCurrentRange(getDateRange(timeFrame));
    }, [timeFrame]);

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

    const labels = generateBarChartLabels(timeFrame, currentRange);

    const aggregatedData = aggregateData(incomes, currentRange, timeFrame, incomeType === 'all' ? null : incomeType, 'added_at');

    const incomeSummary = incomes.reduce(
        (acc, income) => {
            acc[income.type] += parseFloat(income.amount);
            return acc;
        },
        { salary: 0, passive: 0 }
    );

    const totalIncome = incomeSummary.salary + incomeSummary.passive;

    const pieChartData = {
        labels: [t('salary'), t('passiveIncome')],
        datasets: [
            {
                data: [
                    totalIncome > 0 ? ((incomeSummary.salary / totalIncome) * 100).toFixed(2) : 0,
                    totalIncome > 0 ? ((incomeSummary.passive / totalIncome) * 100).toFixed(2) : 0,
                ],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                borderColor: 'transparent',
            },
        ],
    };

    const barChartData = {
        labels,
        datasets: incomeType === 'all' ? [
            {
                label: t('salary'),
                data: aggregateData(incomes, currentRange, timeFrame, 'salary', 'added_at'),
                backgroundColor: '#36A2EB',
            },
            {
                label: t('passiveIncome'),
                data: aggregateData(incomes, currentRange, timeFrame, 'passive', 'added_at'),
                backgroundColor: '#FF6384',
            },
        ] : [
            {
                label: t(incomeType),
                data: aggregatedData,
                backgroundColor: incomeType === 'salary' ? '#36A2EB' : '#FF6384',
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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
                display: false,
                position: 'top',
            },
        },
    };

    const barChartOptions = {
        plugins: {
            legend: {
                display: false,
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
                    text: 'Date',
                },
                ticks: {
                    color: '#ddd',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: false,
                    text: 'Amount',
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
        <div className="income-dashboard">
            <h2>{t('incomeOverview')}</h2>
            <div className="income-filters">
                <NavigationControls
                    navigatePeriod={navigatePeriod}
                    currentRange={currentRange}
                    formatDateToGerman={formatDateToGerman}
                />
                <FilterControls
                    timeFrame={timeFrame}
                    setTimeFrame={setTimeFrame}
                    type={incomeType}
                    setType={setIncomeType}
                    typeOptions={['salary', 'passive']}
                />
            </div>
            
            <div className="charts-container">
                <PieChart
                    pieChartData={pieChartData}
                    pieChartOptions={pieChartOptions}
                    totalIncome={totalIncome}
                    incomeSummary={incomeSummary}
                />
                <BarChart
                    barChartData={barChartData}
                    barChartOptions={barChartOptions}
                />
            </div>
        </div>
    );
};

export default IncomeDashboard;
