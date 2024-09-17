import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExpenseDetailsPopup from './ExpenseDetailsPopup';
import './TaxReturnStyles/DeductibleExpenseReview.css';

const DeductibleExpenseReview = ({ expenses, taxDeductions = [] }) => { // Provide default empty array
  const { t } = useTranslation('taxReturnPage');
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Filter deductible expenses and exclude those already added to tax_deductions
  const deductibleExpenses = expenses.filter(expense => 
    expense.deductible && 
    !taxDeductions.some(deduction => deduction.expense_id === expense.id)
  );

  const handleRowClick = (expense) => {
    setSelectedExpense(expense); // Open popup with selected expense
  };

  return (
    <div className="deductible-expense-review">
      <h2>{t('deductibleExpenseReview')}</h2>

      {deductibleExpenses.length > 0 ? (
        <table className="expense-table">
          <thead>
            <tr>
              <th>{t('type')}</th>
              <th>{t('amount')}</th>
              <th>{t('date')}</th>
              <th>{t('auto')}</th>
            </tr>
          </thead>
          <tbody>
            {deductibleExpenses.map((expense) => (
              <tr key={expense.id} onClick={() => handleRowClick(expense)}>
                <td>{expense.type}</td>
                <td>{expense.amount} €</td>
                <td>{expense.date}</td>
                <td>{expense.auto ? t('yes') : t('no')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t('noDeductibleExpenses')}</p>
      )}

      {selectedExpense && (
        <ExpenseDetailsPopup
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)} // Close popup
        />
      )}
    </div>
  );
};

export default DeductibleExpenseReview;
