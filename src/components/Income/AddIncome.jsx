import { useState } from 'react';
import piggyBank from '../../assets/piggy-bank.png';
import './incomeStyles/AddIncome.css';

const AddIncome = ({ onAddIncome }) => {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [hpw, setHPW] = useState('');
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [dom, setDOM] = useState('');
  const [error, setError] = useState(''); // State for error messages

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the type is selected
    if (!type) {
      setError('Please select an income type.');
      return; // Prevent submission
    }

    const incomeData = {
      type,
      amount: parseFloat(amount),
      auto: autoRepeat ? 1 : 0, // Set auto based on the checkbox state
    };

    if (type === 'salary') {
      incomeData.hpw = parseInt(hpw, 10);
      if (autoRepeat) {
        incomeData.dom = dom === '0' ? 0 : parseInt(dom, 10);
      }
    }

    // Call the function to add income
    onAddIncome(incomeData);

    // Reset form fields and error
    setType('');
    setAmount('');
    setHPW('');
    setAutoRepeat(false);
    setDOM('');
    setError('');
  };

  return (
    <div className="add-income">
      <div className='add-income-con'>
        <img src={piggyBank} alt='piggy Bank' />
        <form onSubmit={handleSubmit}>
          <h3>Add Income</h3>
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
                  <select
                    id="dom"
                    value={dom}
                    onChange={(e) => setDOM(e.target.value)}
                    required
                  >
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

          {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
          <button type="submit">Add Income</button>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
