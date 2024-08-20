import React from 'react';
import AvailableBalance from './AvailableBalance';
import WalletButton from './WalletButton';
import './PocketsStyles/Pockets.css';
import PocketsSection from './PocketsSection';
import PocketTransactions from './PocketTransactions';
import PocketsAnalysis from './PocketsAnalysis';

const PocketsPage = () => {
  return (
    <div className="pockets-page">
      <AvailableBalance />
      <PocketsSection />
      <PocketTransactions />
      <PocketsAnalysis />
      {/* Other sections like pockets display, charts, etc., can be added here */}
    </div>
  );
};

export default PocketsPage;
