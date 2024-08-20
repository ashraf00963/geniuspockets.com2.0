import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPocketsAsync, depositAsync, withdrawAsync } from '../../redux/slices/pocketSlice';
import { validateSession } from '../../redux/slices/authSlice';
import jar from '../../assets/jar.png';
import brokenJar from '../../assets/saving.png';
import './PocketsStyles/WalletModal.css';

const WalletModal = ({ onClose }) => {
  const dispatch = useDispatch();
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
      alert('User not authenticated. Please log in.');
      return;
    }

    const payload = {
      pocketId: selectedPocket,
      amount: parseFloat(amount),
      user_id: user.id,  // Ensure user_id is included in the payload
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
            Deposit
          </button>
          <button
            className={`toggle-button ${!isDeposit ? 'active' : ''}`}
            onClick={() => setIsDeposit(false)}
            disabled={!isDeposit}
          >
            Withdraw
          </button>
        </div>
        {isDeposit ? <img src={jar} alt='pocket icon' /> : <img src={brokenJar} alt='broken jar' />}
        <div className="modal-body">
          <div className="form-group">
            <select value={selectedPocket} onChange={(e) => setSelectedPocket(e.target.value)} required>
              <option value="" disabled hidden>
                Pocket
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
              placeholder="Amount"
              max={isDeposit ? availableBalance : undefined}
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleConfirm} className="confirm-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
