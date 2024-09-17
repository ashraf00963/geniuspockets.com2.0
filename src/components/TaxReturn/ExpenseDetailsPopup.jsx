import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTaxDeductionAsync } from '../../redux/slices/taxDeductionsSlice'; 
import TransportDetails from './TransportDetails';
import { useTranslation } from 'react-i18next';

const ExpenseDetailsPopup = ({ expense, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('taxReturnPage');
  const [step, setStep] = useState(1);
  const [transportData, setTransportData] = useState(null);
  const [customType, setCustomType] = useState('');

  const calculateRefundEstimate = (transportData) => {
    let refundEstimate = 0;

    // Assuming 0.30 € refund per km and some logic for public transport
    if (transportData.transportType === 'car') {
      const { distance, daysPerWeek } = transportData;
      refundEstimate = distance * daysPerWeek * 4 * 0.30; // 4 weeks in a month
    } else if (transportData.transportType === 'public') {
      // Public transport, we use the cost entered by the user
      refundEstimate = transportData.publicTransportCost;
    }

    return refundEstimate.toFixed(2); // Return formatted value as string
  };

  const handleProceed = (data) => {
    const refundEstimate = calculateRefundEstimate(data);
    setTransportData({ ...data, refundEstimate });
    setStep(2); // Proceed to the confirmation step
  };

  const handleSubmit = () => {
    const fullExpenseData = { 
      user_id: expense.user_id,
      expense_id: expense.id,
      type: expense.type === 'custom' ? customType : expense.type,
      deductible_amount: expense.amount,
      refund_amount: transportData?.refundEstimate || expense.amount, // Use the calculated refund estimate
    };
    
    // Dispatch the action to save data
    dispatch(addTaxDeductionAsync(fullExpenseData));
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>{t('deductibleExpenseReview')}</h3>

        {/* Step 1: Input details for transport-related expenses */}
        {step === 1 && expense.type === 'transportion' && (
          <TransportDetails onProceed={handleProceed} expense={expense} />
        )}

        {/* Step 1: Show details for non-transport expenses */}
        {step === 1 && expense.type !== 'transportion' && (
          <div>
            <h4>{t('expenseDetails')}</h4>
            <p>{t('type')}: {expense.type}</p>
            <p>{t('amount')}: {expense.amount} €</p>
            <button onClick={handleSubmit}>{t('confirm')}</button>
            <button onClick={onClose}>{t('cancel')}</button>
          </div>
        )}

        {/* Step 2: Confirmation page for transport expenses */}
        {step === 2 && (
          <div>
            <h4>{t('confirmDetails')}</h4>
            <p>{t('transportType')}: {transportData.transportType}</p>
            {transportData.transportType === 'car' && (
              <>
                <p>{t('distanceToWork')}: {transportData.distance} km</p>
                <p>{t('daysPerWeek')}: {transportData.daysPerWeek}</p>
                <p>{t('estimatedRefund')}: {transportData.refundEstimate} €</p>
              </>
            )}
            {transportData.transportType === 'homeOffice' && (
              <>
                <p>{t('homeOfficeCost')}: {transportData.homeOfficeCost} €</p>
                <p>{t('internetCost')}: {transportData.internetCost} €</p>
              </>
            )}
            <button onClick={handleSubmit}>{t('confirm')}</button>
            <button onClick={onClose}>{t('cancel')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseDetailsPopup;
