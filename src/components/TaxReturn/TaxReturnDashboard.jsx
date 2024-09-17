import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { validateSession } from '../../redux/slices/authSlice';
import { fetchIncomesAsync } from '../../redux/slices/incomeSlice';
import { fetchExpensesAsync } from '../../redux/slices/expenseSlice'; // Import the action to fetch expenses
import TaxableIncome from './TaxableIncome';
import DeductibleExpenseReview from './DeductibleExpenseReview';
import './taxReturnStyles/TaxReturnDashboard.css';

const TaxReturnDashboard = () => {
  const { t } = useTranslation('taxReturn');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { incomes, loading } = useSelector((state) => state.income);
  const { expenses } = useSelector((state) => state.expense); // Access the expenses from Redux store

  useEffect(() => {
    if (!user) {
      dispatch(validateSession());
    } else {
      dispatch(fetchIncomesAsync());
      dispatch(fetchExpensesAsync()); // Fetch expenses as well
    }
  }, [dispatch, user]);

  return (
    <div className="tax-return-dashboard">
      <h2>{t('tax_return_management')}</h2>
      {/* Add the taxable income component */}
      <TaxableIncome incomes={incomes} />
      {/* Pass expenses to DeductibleExpenseReview */}
      <DeductibleExpenseReview expenses={expenses} />
    </div>
  );
};

export default TaxReturnDashboard;
