import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpenseAsync } from '../../../redux/slices/expenseSlice';
import expenseIcon from '../../../assets/minus.webp';
import { ToastContainer } from 'react-toastify';
import { notifySuccess, notifyError } from '../../../utils/notificationService'; // Import notification service
import 'react-toastify/dist/ReactToastify.css';
import './balanceStyles/AddExpense.css';
import { useTranslation } from 'react-i18next';

const AddExpense = ({ onClose, user_id }) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.expense);
  const [type, setType] = useState('');
  const [customType, setCustomType] = useState('');
  const [amount, setAmount] = useState('');
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [dom, setDOM] = useState('');
  const [formError, setFormError] = useState(''); 
  const { t } = useTranslation();

  useEffect(() => {
    if (error) {
      notifyError(error); // Display error as a toast notification
    }

    if (message) {
      notifySuccess(message); // Display success message as a toast notification
    }

  }, [message, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the type is selected
    if (!type) {
      setFormError('Please select an expense type.');
      return; // Prevent submission
    }

    const expenseData = {
      user_id: user_id,
      type: type === 'custom' ? customType : type,
      amount: parseFloat(amount),
      auto: autoRepeat ? 1 : 0, // Set auto based on the checkbox state
    };

    if (autoRepeat) {
      expenseData.dom = dom === '0' ? 0 : parseInt(dom, 10);
    }

    // Dispatch action to add expense
    dispatch(addExpenseAsync(expenseData));

    // Reset form fields and error
    setType('');
    setCustomType('');
    setAmount('');
    setAutoRepeat(false);
    setDOM('');
    setFormError('');
  };

  return (
    <div className="add-expense">
      <div className="add-expense-con">
        <img className='add-expense-icon' src={expenseIcon} alt='Expense Icon' />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="" disabled hidden>
                --Type--
              </option>
              <option value="groceries">{t('groceries')}</option>
              <option value="rent">{t('rent')}</option>
              <option value="utilities">{t('utilities')}</option>
              <option value="subscriptions">{t('subscriptions')}</option>
              <option value="entertainment">{t('entertainment')}</option>
              <option value="work-related">{t('workRelated')}</option> 
              <option value="medical">{t('medical')}</option> 
              <option value="charitable-donations">{t('charitableDonations')}</option> 
              <option value="transportion">{t('Transportion')}</option> 
              <option value="car-maintenance">{t('carMaintenance')}</option> 
              <option value="custom">{t('custom')}</option>
            </select>
          </div>

          {type === 'custom' && (
            <div className="form-group">
              <input
                type="text"
                id="customType"
                value={customType}
                placeholder='Custom Type'
                onChange={(e) => setCustomType(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="number"
              id="amount"
              value={amount}
              placeholder='Amount'
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group-checkbox">
            <label htmlFor="auto-repeat">Auto Repeat</label>
            <input
              type="checkbox"
              id="auto-repeat"
              checked={autoRepeat}
              onChange={(e) => setAutoRepeat(e.target.checked)}
            />
          </div>

          {autoRepeat && (
            <div className="form-group">
              <label htmlFor="dom">Day Of Month</label>
              <select id="dom" value={dom} onChange={(e) => setDOM(e.target.value)} required>
                {[...Array(29).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
                <option value="0">Last Day of Month</option>
              </select>
            </div>
          )}

          {formError && <p className="error-message">{formError}</p>} {/* Display form error message if any */}
          <div className='add-expense-btns'>
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button className='confirm-btn' type="submit">Confirm</button>
          </div>
        </form>
      </div>
      <ToastContainer />  {/* Toast container to display notifications */}
    </div>
  );
};

export default AddExpense;
