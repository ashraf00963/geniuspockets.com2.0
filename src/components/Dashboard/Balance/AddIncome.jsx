import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addIncomeAsync } from '../../../redux/slices/incomeSlice'; 
import incomeIcon from '../../../assets/income.png';
import './balanceStyles/AddIncome.css';

const AddIncome = ({ onClose, user_id }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.income); 

  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [hpw, setHPW] = useState('');
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [dom, setDOM] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!type) {
      setFormError('Please select an income type.');
      return;
    }

    const incomeData = {
      user_id: user_id,
      type,
      amount: parseFloat(amount),
      auto: autoRepeat ? 1 : 0,
    };

    if (type === 'salary') {
      incomeData.hpw = parseInt(hpw, 10);
      if (autoRepeat) {
        incomeData.dom = dom === '0' ? 0 : parseInt(dom, 10);
      }
    }

    // Dispatch action to add income
    dispatch(addIncomeAsync(incomeData));

    // Reset form fields and error
    setType('');
    setAmount('');
    setHPW('');
    setAutoRepeat(false);
    setDOM('');
    setFormError('');
  };

  return (
    <div className="add-income">
      <div className='add-income-con'>
        <img className='add-income-icon' src={incomeIcon} alt='Income Icon' />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="" disabled hidden>
                --Type--
              </option>
              <option value="salary">Salary</option>
              <option value="passive">Passive Income</option>
              <option value="savings">Savings</option>
            </select>
          </div>

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

          {type === 'salary' && (
            <>
              <div className="form-group">
                <input
                  type="number"
                  id="hpw"
                  value={hpw}
                  placeholder='Hours Per Week'
                  onChange={(e) => setHPW(e.target.value)}
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
            </>
          )}

          {formError && <p className="error-message">{formError}</p>}
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className='income-page-btns'>
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button className='confirm-btn' type="submit">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
