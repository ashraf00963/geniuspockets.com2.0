import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPocketTransactionsAsync } from '../../redux/slices/pocketSlice';
import LineChart from './charts/LineChart';
import './PocketsStyles/PocketTransactions.css';

const PocketTransactions = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.pockets.transactions);
    
    useEffect(() => {
        dispatch(fetchPocketTransactionsAsync()); // Fetch all transactions
    }, [dispatch]);

    // Slice the last 6 transactions from the array and reverse them to show the latest first
    const lastTransactions = transactions.slice(-6).reverse();

    return (
        <div className="pocket-transactions">
            <div className="chart-section">
                <LineChart data={transactions} />
            </div>
            <div className="history-table">
                <table>
                    <thead>
                        <tr>
                            <th>Pocket</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastTransactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.pocket_name}</td>
                                <td className={transaction.transaction_type === 'deposit' ? 'positive' : 'negative'}>
                                    {transaction.transaction_type === 'deposit' ? '+' : '-'}
                                    {transaction.amount.toLocaleString()}€
                                </td>
                                <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PocketTransactions;
