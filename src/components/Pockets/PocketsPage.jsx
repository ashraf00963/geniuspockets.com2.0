import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateSession } from '../../redux/slices/authSlice';
import { fetchPocketsAsync } from '../../redux/slices/pocketSlice';
import AvailableBalance from './AvailableBalance';
import WalletButton from './WalletButton';
import './PocketsStyles/Pockets.css';
import PocketsSection from './PocketsSection';
import PocketTransactions from './PocketTransactions';
import PocketsAnalysis from './PocketsAnalysis';
import LoadingOverlay from '../Loading/LoadingOverlay';

const PocketsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const pocketLoading = useSelector((state) => state.pockets.loading);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    if (!user) {
      dispatch(validateSession());
    } else {
      dispatch(fetchPocketsAsync());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!pocketLoading && user) {
      setTimeout(() => {
        setOverlayVisible(false);
      }, 900); // Ensure smooth transition
    }
  }, [pocketLoading, user]);

  const handleLoadingComplete = () => {
    setOverlayVisible(false);
  };

  if (!user) {
    return;
  }

  return (
    <div className="pockets-page">
      {overlayVisible && <LoadingOverlay onLoadingComplete={handleLoadingComplete} />}
      <AvailableBalance />
      <PocketsSection />
      <PocketTransactions />
      <PocketsAnalysis />
      {/* Other sections like pockets display, charts, etc., can be added here */}
    </div>
  );
};

export default PocketsPage;
