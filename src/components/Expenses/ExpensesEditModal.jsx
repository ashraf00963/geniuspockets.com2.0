import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateExpenseAsync, deleteExpenseAsync } from '../../redux/slices/expenseSlice';
import './expenseStyles/ExpensesEditModal.css';

const ExpensesEditModal = ({ expense, onClose }) => {
  const { t } = useTranslation('expensesPage');
  const dispatch = useDispatch();

  const predefinedTypes = ['groceries', 'rent', 'utilities', 'subscriptions', 'entertainment', 'work-related', 'medical', 'charitable-donations'];

  const [type, setType] = useState(predefinedTypes.includes(expense.type) ? expense.type : 'custom');
  const [customType, setCustomType] = useState(!predefinedTypes.includes(expense.type) ? expense.type : '');
  const [amount, setAmount] = useState(expense.amount);
  const [auto, setAuto] = useState(expense.auto);
  const [dom, setDom] = useState(expense.dom || '');
  const [deductible, setDeductible] = useState(expense.deductible); // Deductible state

  const handleUpdate = () => {
    if (auto && !dom) {
      alert(t('selectDayOfMonth'));
      return;
    }
    const updatedType = type === 'custom' ? customType : type;
    dispatch(updateExpenseAsync({ ...expense, type: updatedType, amount, auto, dom, deductible }));
    onClose();
  };

  const handleDelete = () => {
    dispatch(deleteExpenseAsync(expense.id));
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal__content">
        <h3 className="modal__title">{t('editExpense')}</h3>
        <form className="modal__form">
          <label className="modal__label">
            {t('type')}:
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="modal__input--select"
            >
              {predefinedTypes.map(preType => (
                <option value={preType} key={preType}>{t(preType)}</option>
              ))}
              <option value="custom">{customType}</option>
            </select>
          </label>

          <label className="modal__label">
            {t('amount')}:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="modal__input--number"
            />
          </label>

          {/* Repeat Switch */}
          <div className="modal__label-switch">
            <label>{t('repeat')}:</label>
            <input 
              type="checkbox" 
              id="switch-repeat" 
              checked={auto} 
              onChange={(e) => setAuto(e.target.checked ? 1 : 0)} 
              className="modal__switch"
            />
            <label htmlFor="switch-repeat" id="label-switch-deductible" className="modal__switch-label">Toggle</label>
          </div>

          {auto && (
            <label className="modal__label">
              {t('dayOfMonth')}:
              <input
                type="number"
                value={dom}
                onChange={(e) => setDom(e.target.value)}
                min="1"
                max="31"
                className="modal__input--number"
              />
            </label>
          )
          ||
          null
          }

          {/* Deductible Switch */}
          <div className="modal__label-switch">
            <label>{t('markAsDeductible')}:</label>
            <input 
              type="checkbox" 
              id="switch-deductible" 
              checked={deductible} 
              onChange={(e) => setDeductible(e.target.checked ? 1 : 0)} 
              className="modal__switch"
            />
            <label htmlFor="switch-deductible" id="label-switch-deductible" className="modal__switch-label">Toggle</label>
          </div>
        </form>

        <div className="modal__actions">
          <button className="modal__button" onClick={onClose}>{t('close')}</button>
          <button className="modal__button" onClick={handleDelete}>{t('delete')}</button>
          <button className="modal__button modal__button--update" onClick={handleUpdate}>{t('update')}</button>
        </div>
      </div>
    </div>
  );
};

export default ExpensesEditModal;
