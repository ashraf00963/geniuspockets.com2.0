import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateIncomeAsync, deleteIncomeAsync } from '../../redux/slices/incomeSlice';
import './incomeStyles/IncomeHistory.css';

const IncomeEditModal = ({ income, onClose }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState(income.type);
  const [amount, setAmount] = useState(income.amount);
  const [auto, setAuto] = useState(income.auto);

  const handleUpdate = () => {
    dispatch(updateIncomeAsync({ ...income, type, amount, auto }));
    onClose();
  };

  const handleDelete = () => {
    dispatch(deleteIncomeAsync(income.id));
    onClose();
  };

  return (
    <div className="income-edit-modal">
      <div className="modal-content">
        <h3>Edit Income</h3>
        <form>
          <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="salary">Salary</option>
              <option value="passive">Passive Income</option>
            </select>
          </label>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label>
            Repeat:
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) => setAuto(e.target.checked ? 1 : 0)}
            />
          </label>
        </form>
        <div className="modal-actions">
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default IncomeEditModal;
