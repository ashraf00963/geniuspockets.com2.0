import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailableBalanceAsync } from '../../redux/slices/availableBalanceSlice';
import './PocketsStyles/Pockets.css';
import WalletButton from './WalletButton';

const AvailableBalance = () => {
  const dispatch = useDispatch();
  const availableBalance = useSelector((state) => state.availableBalance.balance);

  useEffect(() => {
    dispatch(fetchAvailableBalanceAsync());
  }, [dispatch]);

  return (
    <div className="available-balance-card">
      <div className='a-balance-info'>
        <h3>Available Balance</h3>
        <p className="balance-amount">
          €{availableBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
        </p>
      </div>
      <WalletButton />
    </div>
  );
};

export default AvailableBalance;
