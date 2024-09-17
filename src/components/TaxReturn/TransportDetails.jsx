import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TransportDetails = ({ onProceed, expense }) => {
  const { t } = useTranslation('taxReturnPage');
  const [transportType, setTransportType] = useState('');
  const [distance, setDistance] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [monthlyRefund, setMonthlyRefund] = useState(0);

  const handleTransportTypeSelect = (type) => {
    setTransportType(type);
  };

  const calculateRefund = () => {
    const costPerKm = 0.30; // Example value (can be adjusted based on tax rules)
    const totalKmPerWeek = distance * daysPerWeek;
    const totalKmPerMonth = totalKmPerWeek * 4; // Assume 4 weeks per month
    let refund = totalKmPerMonth * costPerKm;
    
    // Cap the refund by the actual expense amount
    refund = Math.min(refund, parseFloat(expense.amount)); 
    
    
    setMonthlyRefund(refund.toFixed(2)); // Show refund with two decimal places
  };

  const handleNextStep = () => {
    calculateRefund();
    const data = {
      transportType,
      distance: transportType === 'car' || transportType === 'public' ? distance : null,
      daysPerWeek: transportType === 'car' || transportType === 'public' ? daysPerWeek : null,
      monthlyRefund,
      deductible_amount: expense.amount, // Ensure we use the actual amount of the expense
    };
    onProceed(data); // Send data to parent component
  };

  return (
    <div className="transport-details">
      <h4>{t('selectTransportType')}</h4>
      <button onClick={() => handleTransportTypeSelect('car')}>{t('car')}</button>
      <button onClick={() => handleTransportTypeSelect('public')}>{t('publicTransport')}</button>
      <button onClick={() => handleTransportTypeSelect('homeOffice')}>{t('homeOffice')}</button>

      {/* Car and public transport-related questions */}
      {(transportType === 'car' || transportType === 'public') && (
        <div>
          <label>{t('distanceToWork')} (km):</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <label>{t('daysPerWeek')}:</label>
          <input
            type="number"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(e.target.value)}
          />
        </div>
      )}

      {/* Refund display */}
      {(transportType === 'car' || transportType === 'public') && monthlyRefund > 0 && (
        <div>
          <h4>{t('estimatedMonthlyRefund')}: {monthlyRefund} €</h4>
        </div>
      )}

      {/* Home office-related questions */}
      {transportType === 'homeOffice' && (
        <div>
          <label>{t('homeOfficeCost')}:</label>
          <input
            type="number"
            value={expense.amount}
            disabled // Use the expense amount directly
          />
          <label>{t('internetCost')}:</label>
          <input
            type="number"
            value={expense.amount}
            disabled
          />
        </div>
      )}

      {/* Proceed Button */}
      <button onClick={handleNextStep}>{t('proceed')}</button>
    </div>
  );
};

export default TransportDetails;
