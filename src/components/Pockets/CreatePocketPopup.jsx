import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPocketAsync, fetchPocketsAsync } from '../../redux/slices/pocketSlice'; // Import fetchPocketsAsync
import { validateSession } from '../../redux/slices/authSlice';
import pocket from '../../assets/pocket.png';
import './PocketsStyles/CreatePocketPopup.css';

const CreatePocketPopup = ({ onClose }) => {
  const [name, setName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatch(validateSession());
    }
  }, [dispatch, user]);

  const { loading, error } = useSelector((state) => state.pockets);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      console.error('User ID is missing. Cannot create a pocket without it.');
      return;
    }

    const pocketData = {
      name,
      goal_amount: goalAmount,
      deadline,
      user_id: user.id,
    };

    console.log('Submitting Pocket Data:', pocketData);

    dispatch(addPocketAsync(pocketData)).then((result) => {
      if (result.type === 'pockets/addPocket/fulfilled') {
        dispatch(fetchPocketsAsync()); // Fetch the updated list of pockets
        onClose(); // Close the popup after success
      }
    });
  };

  return (
    <div className="create-pocket-popup">
      <div className="popup-content">
        <img src={pocket} alt='pocket icon' />
        <h3>Create New Pocket</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={name}
              placeholder='Pocket Name'
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              value={goalAmount}
              placeholder='Goal Amount'
              onChange={(e) => setGoalAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error.message || error}</p>}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="confirm-button" disabled={loading}>
              {loading ? 'Creating...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePocketPopup;
