// src/components/Dashboard/RecentTransactions.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncomesAsync } from '../../redux/slices/incomeSlice';
import { fetchExpensesAsync } from '../../redux/slices/expenseSlice';
import './dashboardStyles/RecentTransactions.css';

const RecentTransactions = () => {
  const dispatch = useDispatch();
  const incomes = useSelector((state) => state.income.incomes);
  const expenses = useSelector((state) => state.expense.expenses);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    dispatch(fetchIncomesAsync());
    dispatch(fetchExpensesAsync());
  }, [dispatch]);

  useEffect(() => {
    // Combine and sort the transactions by date
    const combinedTransactions = [...incomes, ...expenses].sort(
      (a, b) => new Date(b.added_at || b.date) - new Date(a.added_at || a.date)
    );

    // Take the most recent 5 transactions
    const recentTransactions = combinedTransactions.slice(0, 5);

    setTransactions(recentTransactions);
  }, [incomes, expenses]);

  return (
    <div className="recent-transactions">
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-type">{transaction.type}</div>
            <div className="transaction-date">
              {new Date(transaction.added_at || transaction.date).toLocaleDateString()}
            </div>
            <div
              className={`transaction-amount ${
                incomes.includes(transaction) ? 'income-amount' : 'expense-amount'
              }`}
            >
              {incomes.includes(transaction)
                ? `+€${parseFloat(transaction.amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}`
                : `-€${Math.abs(parseFloat(transaction.amount)).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
