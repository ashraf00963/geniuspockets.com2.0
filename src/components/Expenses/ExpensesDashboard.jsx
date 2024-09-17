import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchExpensesAsync } from '../../redux/slices/expenseSlice';
import { getDateRange } from '../../utils/dateUtils';
import { generateBarChartLabels, aggregateData } from '../../utils/chartUtils';
import { getTypeColors } from '../../utils/colorUtils';
import { formatDateToGerman } from '../../utils/formatUtils';
import { notifySuccess, notifyError } from '../../utils/notificationService';
import NavigationControls from '../common/NavigationControls';
import FilterControls from '../common/FilterControls';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import './expenseStyles/ExpensesDashboard.css';

const colorPalette = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#66FF66', '#FF6666', '#66B2FF', '#FFB266'
];

const ExpensesDashboard = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation('expensesPage'); // Initialize the translation hook
    const { loading, error, expenses, message } = useSelector((state) => state.expense);

    const [timeFrame, setTimeFrame] = useState('week');
    const [expenseType, setExpenseType] = useState('all');
    const [currentRange, setCurrentRange] = useState(getDateRange('week'));

    useEffect(() => {
        if (error) {
            notifyError(error);  // Use centralized error notification
        }

        if (message) {
            notifySuccess(message);  // Use centralized success notification
        }

    }, [message, error, dispatch]);

    useEffect(() => {
        dispatch(fetchExpensesAsync());
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

    const filteredData = expenseType === 'all'
        ? expenses
        : expenses.filter(expense => expense.type === expenseType);

    const expenseTypes = expenseType === 'all'
        ? expenses.reduce((types, expense) => {
            if (!types.includes(expense.type)) types.push(expense.type);
            return types;
        }, [])
        : [expenseType];

    const typeColors = getTypeColors(expenseTypes, colorPalette);

    const datasets = expenseTypes.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        data: aggregateData(filteredData, currentRange, timeFrame, type, 'date'),
        backgroundColor: typeColors[type],
    }));

    const expenseSummary = filteredData.reduce((acc, expense) => {
        acc[expense.type] = (acc[expense.type] || 0) + parseFloat(expense.amount);
        return acc;
    }, {});

    return (
        <div className="expenses-dashboard">
            <h2>{t('expensesOverview')}</h2> {/* Use translation key */}
            <div className="expenses-filters">
                <NavigationControls
                    navigatePeriod={navigatePeriod}
                    currentRange={currentRange}
                    formatDateToGerman={formatDateToGerman}
                />
                <FilterControls
                    timeFrame={timeFrame}
                    setTimeFrame={setTimeFrame}
                    type={expenseType}
                    setType={setExpenseType}
                    typeOptions={[...expenseTypes]}
                />
            </div>

            <div className="charts-container">
                <div className="pie-chart-card">
                    <div style={{ position: 'relative', width: '100%', height: '250px', display: 'flex', alignItems: 'center' }}>
                        <PieChart data={expenseSummary} />
                    </div>
                </div>
                <div className="bar-chart-card">
                    <BarChart labels={labels} datasets={datasets} />
                </div>
            </div>
        </div>
    );
};

export default ExpensesDashboard;
