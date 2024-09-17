import React, { useState } from 'react';
import AddIncome from './AddIncome'; 
import AddExpense from './AddExpense'; 
import './balanceStyles/IncomeAndExpenseModal.css';

const IncomeAndExpenseModal = ({ onClose, user_id }) => {
  const [isIncomeSelected, setIsIncomeSelected] = useState(true); // State to toggle between income and expense

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <button
            className={`toggle-button ${isIncomeSelected ? 'active' : ''}`}
            onClick={() => setIsIncomeSelected(true)}
            disabled={isIncomeSelected}
          >
            Income
          </button>
          <button
            className={`toggle-button ${!isIncomeSelected ? 'active' : ''}`}
            onClick={() => setIsIncomeSelected(false)}
            disabled={!isIncomeSelected}
          >
            Expense
          </button>
        </div>
        <div className="modal-body">
          {isIncomeSelected ? (
            <AddIncome onClose={onClose} user_id={user_id} />
          ) : (
            <AddExpense onClose={onClose} user_id={user_id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeAndExpenseModal;
