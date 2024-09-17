import React, { useState, useEffect } from 'react';
import { fetchTotalBalanceAsync } from '../../../redux/slices/totalBalanceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { notifySuccess, notifyError } from '../../../utils/notificationService';
import IncomeAndExpenseModal from './IncomeAndExpenseModal';
import card from '../../../assets/debit-card.webp';
import './balanceStyles/TotalBalance.css';

const TotalBalance = ({ user_id }) => {
  const dispatch = useDispatch();
  const { totalBalance, loading, error, message } = useSelector((state) => state.totalBalance); // Ensure you're using the correct slice
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user_id) {
      dispatch(fetchTotalBalanceAsync(user_id.id));
    }
  }, [dispatch, user_id]);

  useEffect(() => {
    if (error) {
      notifyError(error); // Display error as a toast notification
    }

    if (message) {
      notifySuccess(message); // Display success message as a toast notification
    }
  }, [message, error, dispatch]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // Format the total balance using European number formatting
  const formattedBalance = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(totalBalance ?? 0);

  return (
    <div className="total-balance-card">
      <div className='total-balance'>
        <h3>Total Balance</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <p className="balance-amount">{formattedBalance}</p>
        )}
      </div>
      <button className="add-button" onClick={toggleModal}>
        <img className='debit-card' src={card} alt='debit card' />
      </button>
      {modalOpen && <IncomeAndExpenseModal user_id={user_id.id} onClose={toggleModal} />}
    </div>
  );
};

export default TotalBalance;
