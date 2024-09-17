import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import IncomeEditModal from './IncomeEditModal';
import { formatDateToGerman, formatNumberToGerman } from '../../utils/formatUtils';
import './incomeStyles/IncomeHistory.css';

const IncomeHistory = () => {
  const { t } = useTranslation('incomePage');  // Initialize the useTranslation hook
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
      <h2>{t('incomeHistory')}</h2>  
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
          {incomes.map((income) => (
            <tr key={income.id} onClick={() => handleRowClick(income)}>
              <td>{income.type}</td>
              <td id='income-amount'>+{formatNumberToGerman(income.amount)}€</td>
              <td id='income-date'>{formatDateToGerman(income.added_at)}</td>
              <td>{income.auto ? t('yes') : t('no')}</td> 
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
