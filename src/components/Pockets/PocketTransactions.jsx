import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPocketTransactionsAsync } from '../../redux/slices/pocketSlice';
import LineChart from './charts/LineChart';
import { formatDateToGerman, formatNumberToGerman } from '../../utils/formatUtils';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './PocketsStyles/PocketTransactions.css';

const PocketTransactions = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation('pocketsPage'); // Assuming your namespace is 'pocketsPage'
    const transactions = useSelector((state) => state.pockets.transactions);

    useEffect(() => {
        dispatch(fetchPocketTransactionsAsync());
    }, [dispatch]);

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
                            <th>{t('pocket')}</th>
                            <th>{t('amount')}</th>
                            <th>{t('date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastTransactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.pocket_name}</td>
                                <td className={transaction.transaction_type === 'deposit' ? 'positive' : 'negative'}>
                                    {transaction.transaction_type === 'deposit' ? '+' : '-'}
                                    {formatNumberToGerman(transaction.amount)}€
                                </td>
                                <td>{formatDateToGerman(transaction.transaction_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PocketTransactions;
