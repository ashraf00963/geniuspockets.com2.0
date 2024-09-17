import React, { useState } from 'react';
import WalletModal from './WalletModal';
import walletIcon from '../../assets/wallet.webp';
import './PocketsStyles/Pockets.css';

const WalletButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="wallet-button-container">
      <button onClick={toggleModal} className="wallet-button">
        <img src={walletIcon} alt="Wallet Icon" />
      </button>
      {modalOpen && <WalletModal onClose={toggleModal} />}
    </div>
  );
};

export default WalletButton;
