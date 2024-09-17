import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import IncomeDashboard from './IncomeDashboard';
import SalaryAnalysisAndTips from './SalaryAnalysisAndTips';
import IncomeHistory from './IncomeHistory';
import { fetchIncomesAsync, fetchUserSalaryAsync } from '../../redux/slices/incomeSlice';
import { validateSession } from '../../redux/slices/authSlice';
import { getDateRange, adjustDateRange } from '../../utils/dateUtils';
import LoadingOverlay from '../Loading/LoadingOverlay';
import './incomeStyles/IncomePage.css';

const IncomePage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('incomePage');  // Initialize the useTranslation hook
  const { loading: incomeLoading, error, incomes, userSalary } = useSelector((state) => state.income);
  const user = useSelector((state) => state.auth.user);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const [timeFrame, setTimeFrame] = useState('Month');
  const [incomeType, setIncomeType] = useState('all');
  const [currentRange, setCurrentRange] = useState(getDateRange('Month'));

  useEffect(() => {
    if (!user) {
      dispatch(validateSession());
    } else {
      dispatch(fetchIncomesAsync());
      dispatch(fetchUserSalaryAsync()); // Fetch user salary
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!incomeLoading && user) {
      // Simulate a small delay to ensure smooth transition
      setTimeout(() => {
        setOverlayVisible(false);
      }, 900);
    }
  }, [incomeLoading, user]);

  const handleLoadingComplete = () => {
    setOverlayVisible(false);
  };

  const navigatePeriod = (direction) => {
    const newRange = adjustDateRange(currentRange, timeFrame, direction);
    setCurrentRange(newRange);
  };

  return (
    <div className="income-page">
      {overlayVisible && <LoadingOverlay onLoadingComplete={handleLoadingComplete} />}
      <h1>{t('incomeManagement')}</h1>  {/* Translated text */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <IncomeDashboard />
      {userSalary && <SalaryAnalysisAndTips user={userSalary} />} {/* Pass userSalary as prop */}
      <IncomeHistory />
    </div>
  );
};

export default IncomePage;
