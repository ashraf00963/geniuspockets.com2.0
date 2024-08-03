import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddIncome from './AddIncome';
import IncomeDashboard from './IncomeDashboard';
import SalaryAnalysisAndTips from './SalaryAnalysisAndTips';
import IncomeHistory from './IncomeHistory'; // Import the IncomeHistory component
import { addIncomeAsync, fetchIncomesAsync } from '../../redux/slices/incomeSlice';
import { validateSession } from '../../redux/slices/authSlice';
import { getDateRange, adjustDateRange } from '../../utils/dateUtils';
import './incomeStyles/IncomePage.css';

const IncomePage = () => {
  const dispatch = useDispatch();
  const { loading, error, incomes } = useSelector((state) => state.income);
  const user = useSelector((state) => state.auth.user);

  const [timeFrame, setTimeFrame] = useState('week');
  const [incomeType, setIncomeType] = useState('all'); // Initialize incomeType
  const [currentRange, setCurrentRange] = useState(getDateRange('week'));

  useEffect(() => {
    if (!user) {
      dispatch(validateSession());
    } else {
      dispatch(fetchIncomesAsync());
    }
  }, [dispatch, user]);

  const handleAddIncome = (incomeData) => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }
    const incomeWithUser = { ...incomeData, user_id: user.id };
    dispatch(addIncomeAsync(incomeWithUser));
  };

  const navigatePeriod = (direction) => {
    const newRange = adjustDateRange(currentRange, timeFrame, direction);
    setCurrentRange(newRange);
  };

  // Example user data for demonstration
  const exampleUserData = {
    monthlySalary: 2500,
    hpw: 45,
    passiveIncome: 300,
  };

  return (
    <div className="income-page">
      <h1>Income Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AddIncome onAddIncome={handleAddIncome} />
      <IncomeDashboard />
      <SalaryAnalysisAndTips user={exampleUserData} />
      <IncomeHistory /> {/* Add the IncomeHistory component here */}
    </div>
  );
};

export default IncomePage;
