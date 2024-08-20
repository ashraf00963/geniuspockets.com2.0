import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IncomeDashboard from './IncomeDashboard';
import SalaryAnalysisAndTips from './SalaryAnalysisAndTips';
import IncomeHistory from './IncomeHistory';
import { fetchIncomesAsync, fetchUserSalaryAsync } from '../../redux/slices/incomeSlice';
import { validateSession } from '../../redux/slices/authSlice';
import { getDateRange, adjustDateRange } from '../../utils/dateUtils';
import './incomeStyles/IncomePage.css';

const IncomePage = () => {
  const dispatch = useDispatch();
  const { loading, error, incomes, userSalary } = useSelector((state) => state.income);
  const user = useSelector((state) => state.auth.user);

  const [timeFrame, setTimeFrame] = useState('week');
  const [incomeType, setIncomeType] = useState('all');
  const [currentRange, setCurrentRange] = useState(getDateRange('week'));

  useEffect(() => {
    if (!user) {
      dispatch(validateSession());
    } else {
      dispatch(fetchIncomesAsync());
      dispatch(fetchUserSalaryAsync()); // Fetch user salary
    }
  }, [dispatch, user]);

  const navigatePeriod = (direction) => {
    const newRange = adjustDateRange(currentRange, timeFrame, direction);
    setCurrentRange(newRange);
  };

  return (
    <div className="income-page">
      <h1>Income Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <IncomeDashboard />
      {userSalary && <SalaryAnalysisAndTips user={userSalary} />} {/* Pass userSalary as prop */}
      <IncomeHistory />
    </div>
  );
};

export default IncomePage;
