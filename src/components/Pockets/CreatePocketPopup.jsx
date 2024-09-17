import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPocketAsync, fetchPocketsAsync } from '../../redux/slices/pocketSlice';
import { validateSession } from '../../redux/slices/authSlice';
import pocket from '../../assets/pocket.webp';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './PocketsStyles/CreatePocketPopup.css';

const CreatePocketPopup = ({ onClose }) => {
  const { t } = useTranslation('pocketsPage'); // Initialize the translation hook
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
      // Notify with toast
      return;
    }

    const pocketData = {
      name,
      goal_amount: goalAmount,
      deadline,
      user_id: user.id,
    };

    console.log(t('submittingPocketData'), pocketData); // Log translated message

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
        <img src={pocket} alt={t('pocketIconAlt')} /> {/* Translate alt text */}
        <h3>{t('createNewPocket')}</h3> {/* Translate title */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={name}
              placeholder={t('pocketName')} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              value={goalAmount}
              placeholder={t('goalAmount')} 
              onChange={(e) => setGoalAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('deadline')}</label> {/* Translate label */}
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              {t('cancel')} {/* Translate button text */}
            </button>
            <button type="submit" className="confirm-button" disabled={loading}>
              {loading ? t('creating') : t('confirm')} {/* Translate button text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePocketPopup;
