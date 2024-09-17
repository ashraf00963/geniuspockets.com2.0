import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPocketsAsync, depositAsync, withdrawAsync } from '../../redux/slices/pocketSlice';
import { validateSession } from '../../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import jar from '../../assets/jar.webp';
import brokenJar from '../../assets/saving.webp';
import './PocketsStyles/WalletModal.css';

const WalletModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('pocketsPage'); // Assuming your namespace is 'pocketsPage'
  const pockets = useSelector((state) => state.pockets.pockets);
  const availableBalance = useSelector((state) => state.availableBalance.balance);
  const user = useSelector((state) => state.auth.user);

  const [isDeposit, setIsDeposit] = useState(true);
  const [selectedPocket, setSelectedPocket] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!user) {
      dispatch(validateSession());
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(fetchPocketsAsync());
  }, [dispatch]);

  const handleConfirm = () => {
    if (!user) {
      alert(t('userNotAuthenticated')); // Use translation for the alert
      return;
    }

    const payload = {
      pocketId: selectedPocket,
      amount: parseFloat(amount),
      user_id: user.id,
    };

    if (isDeposit) {
      dispatch(depositAsync(payload));
    } else {
      dispatch(withdrawAsync(payload));
    }
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <button
            className={`toggle-button ${isDeposit ? 'active' : ''}`}
            onClick={() => setIsDeposit(true)}
            disabled={isDeposit}
          >
            {t('deposit')}
          </button>
          <button
            className={`toggle-button ${!isDeposit ? 'active' : ''}`}
            onClick={() => setIsDeposit(false)}
            disabled={!isDeposit}
          >
            {t('withdraw')}
          </button>
        </div>
        {isDeposit ? <img src={jar} alt={t('pocketIconAlt')} /> : <img src={brokenJar} alt={t('brokenJarIconAlt')} />}
        <div className="modal-body">
          <div className="form-group">
            <select value={selectedPocket} onChange={(e) => setSelectedPocket(e.target.value)} required>
              <option value="" disabled hidden>
                {t('selectPocket')}
              </option>
              {pockets.map((pocket) => (
                <option key={pocket.id} value={pocket.id}>
                  {pocket.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('amount')}
              max={isDeposit ? availableBalance : undefined}
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            {t('cancel')}
          </button>
          <button onClick={handleConfirm} className="confirm-button">
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
