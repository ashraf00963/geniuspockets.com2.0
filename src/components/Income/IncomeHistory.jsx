import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import IncomeEditModal from './IncomeEditModal';
import './incomeStyles/IncomeHistory.css';

const IncomeHistory = () => {
  const { incomes } = useSelector((state) => state.income);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const handleRowClick = (income) => {
    setSelectedIncome(income);
  };

  const closeModal = () => {
    setSelectedIncome(null);
  };

  return (
    <div className="income-history">
      <h2>Income History</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Repeat</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id} onClick={() => handleRowClick(income)}>
              <td>{income.type}</td>
              <td>+{income.amount}€</td>
              <td>{new Date(income.added_at).toLocaleDateString()}</td>
              <td>{income.auto ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedIncome && (
        <IncomeEditModal income={selectedIncome} onClose={closeModal} />
      )}
    </div>
  );
};

export default IncomeHistory;
