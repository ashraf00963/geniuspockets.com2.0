import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { updateIncomeAsync, deleteIncomeAsync } from '../../redux/slices/incomeSlice';
import './incomeStyles/IncomeHistory.css';

const IncomeEditModal = ({ income, onClose }) => {
  const { t } = useTranslation('incomePage'); // Initialize useTranslation hook
  const dispatch = useDispatch();
  
  const [type, setType] = useState(income.type);
  const [amount, setAmount] = useState(income.amount);
  const [grossSalary, setGrossSalary] = useState(income.gross_salary || ''); // New gross salary state
  const [auto, setAuto] = useState(income.auto);
  const [dom, setDom] = useState(income.dom || ''); // Added state for day of month

  const handleUpdate = () => {
    if (auto && !dom) {
      alert(t('selectDayOfMonth')); // Use translation key
      return;
    }

    const incomeData = {
      ...income,
      type,
      amount,
      auto,
      dom,
    };

    if (type === 'salary') {
      incomeData.gross_salary = parseFloat(grossSalary); // Include gross salary if type is salary
    }

    dispatch(updateIncomeAsync(incomeData));
    onClose();
  };

  const handleDelete = () => {
    dispatch(deleteIncomeAsync(income.id));
    onClose();
  };

  return (
    <div className="income-edit-modal">
      <div className="modal-content">
        <h3>{t('editIncome')}</h3>
        <form>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="salary">{t('salary')}</option> 
            <option value="passive">{t('passiveIncome')}</option> 
          </select>
            
          <input
            type="number"
            value={amount}
            placeholder={t('amount')}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          {type === 'salary' && (
            <input
              type="number"
              value={grossSalary}
              placeholder={t('grossSalary')} // Add gross salary field
              onChange={(e) => setGrossSalary(e.target.value)}
            />
          )}

          <div className='repeat-checkbox'>
            <p>{t('repeat')}</p>
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) => setAuto(e.target.checked ? 1 : 0)}
            />
          </div>
          {auto && (
            <label>
              {t('dayOfMonth')}
              <input
                type="number"
                value={dom}
                onChange={(e) => setDom(e.target.value)}
                min="1"
                max="31"
              />
            </label>
          )}
        </form>
        <div className="modal-actions">
          <button onClick={onClose}>{t('close')}</button>
          <button onClick={handleDelete}>{t('delete')}</button>
          <button onClick={handleUpdate}>{t('update')}</button>
        </div>
      </div>
    </div>
  );
};

export default IncomeEditModal;
