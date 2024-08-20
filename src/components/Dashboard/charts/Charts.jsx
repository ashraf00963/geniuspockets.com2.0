// src/components/Dashboard/Charts/Charts.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LineChart from './LineChart';
import PieChart from './PieChart';
import { fetchIncomesAsync } from '../../../redux/slices/incomeSlice';
import { fetchExpensesAsync } from '../../../redux/slices/expenseSlice';
import './chartsStyles/Charts.css';

const Charts = () => {
  const dispatch = useDispatch();
  const incomes = useSelector((state) => state.income.incomes);
  const expenses = useSelector((state) => state.expense.expenses);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    dispatch(fetchIncomesAsync());
    dispatch(fetchExpensesAsync());
  }, [dispatch]);

  useEffect(() => {
    const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    setTotalIncome(totalIncome);
    setTotalExpenses(totalExpenses);
  }, [incomes, expenses]);

  return (
    <div className="charts">
      {// !!! Possible change: both charts connected and legends on top for both with  background of 2e2e2e !!!
      }
      <PieChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
      <LineChart incomeData={incomes} expenseData={expenses} />
    </div>
  );
};

export default Charts;
