import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ExpensesEditModal from './ExpensesEditModal'; 
import { formatDateToGerman, formatNumberToGerman } from '../../utils/formatUtils';
import '../Income/incomeStyles/IncomeHistory.css';
import { getTypeColors } from '../../utils/colorUtils';

const ExpensesHistory = () => {
  const { t } = useTranslation('expensesPage');
  const { expenses } = useSelector((state) => state.expense);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleRowClick = (expense) => {
    setSelectedExpense(expense); // Open modal for editing the expense
  };

  const expenseSummary = expenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const expenseTypes = Object.keys(expenseSummary);
  const typeColors = getTypeColors(expenseTypes);

  return (
    <div className="income-history">
      <h2>{t('expensesHistory')}</h2>

      <table>
        <thead>
          <tr>
            <th>{t('type')}</th>
            <th>{t('amount')}</th>
            <th>{t('date')}</th>
            <th>{t('repeat')}</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} onClick={() => handleRowClick(expense)}>
              <td style={{ color: typeColors[expense.type] }}>{expense.type}</td>
              <td id='expense-amount'>-{formatNumberToGerman(expense.amount)}€</td>
              <td id='income-date'>{formatDateToGerman(expense.date)}</td>
              <td>{expense.auto ? t('yes') : t('no')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedExpense && (
        <ExpensesEditModal 
          expense={selectedExpense} 
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
};

export default ExpensesHistory;
