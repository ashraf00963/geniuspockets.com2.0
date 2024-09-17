import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateSession } from '../../redux/slices/authSlice';
import { fetchExpensesAsync } from '../../redux/slices/expenseSlice'; 
import ExpensesDashboard from './ExpensesDashboard';
import ExpensesAnalysis from './ExpensesAnalysis';
import ExpensesHistory from './ExpensesHistory';
import LoadingOverlay from '../Loading/LoadingOverlay';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './expenseStyles/ExpensesPage.css';

const ExpensesPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('expensesPage'); // Initialize the translation hook
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const expenses = useSelector((state) => state.expense.expenses);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    if (!user) {
      dispatch(validateSession()); 
    } else {
      dispatch(fetchExpensesAsync()); 
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!loading && user) {
      setTimeout(() => {
        setOverlayVisible(false);
      }, 900);
    }
  }, [loading, user]);
  
  const handleLoadingComplete = () => {
    setOverlayVisible(false);
  };

  if (!user) {
    return <p>{t('userNotAuthenticated')}</p>; // Use translation key
  }

  return (
    <div className="expenses-page">
      <h1>{t('expenseManagement')}</h1> {/* Use translation key */}
      {overlayVisible && <LoadingOverlay onLoadingComplete={handleLoadingComplete} />}
      <ExpensesDashboard />
      <ExpensesAnalysis expenses={expenses} />
      <ExpensesHistory />
    </div>
  );
};

export default ExpensesPage;
