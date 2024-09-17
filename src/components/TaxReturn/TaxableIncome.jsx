import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatNumberToGerman } from '../../utils/formatUtils';
import './TaxReturnStyles/TaxableIncome.css';

const TaxableIncome = () => {
  const { t } = useTranslation('taxReturnPage');
  const { incomes } = useSelector((state) => state.income);  // Fetch incomes from Redux store
  const { expenses } = useSelector((state) => state.expense);  // Fetch expenses from Redux store

  const [grossIncome, setGrossIncome] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [taxableIncome, setTaxableIncome] = useState(0);

  useEffect(() => {
    // Calculate the total gross income (check for null/undefined gross_salary)
    const totalGrossIncome = incomes.reduce((acc, income) => {
      const incomeAmount = income.type === 'salary' ? income.gross_salary || 0 : income.amount || 0;
      return acc + parseFloat(incomeAmount);
    }, 0);
    setGrossIncome(totalGrossIncome);

    // Calculate total deductible expenses (check for null/undefined deductible)
    const totalDeductibleExpenses = expenses.reduce((acc, expense) => {
      const expenseAmount = expense.deductible ? expense.amount || 0 : 0;
      return acc + parseFloat(expenseAmount);
    }, 0);
    setTotalDeductions(totalDeductibleExpenses);

    // Calculate taxable income (gross income - deductions)
    const calculatedTaxableIncome = totalGrossIncome - totalDeductibleExpenses;
    setTaxableIncome(calculatedTaxableIncome);

  }, [incomes, expenses]);

  return (
    <div className="taxable-income">
      <h2>{t('taxableIncomeSection')}</h2>

      <div className="income-summary">
        <h3>{t('grossIncome')}</h3>
        <p>{grossIncome > 0 ? `${formatNumberToGerman(grossIncome)} €` : t('noIncomeAdded')}</p>
      </div>

      <div className="deductions-summary">
        <h3>{t('totalDeductions')}</h3>
        <p>{totalDeductions > 0 ? `${formatNumberToGerman(totalDeductions)} €` : t('noDeductions')}</p>
      </div>

      <div className="taxable-income-summary">
        <h3>{t('taxableIncome')}</h3>
        <p>{taxableIncome > 0 ? `${formatNumberToGerman(taxableIncome)} €` : t('noTaxableIncome')}</p>
      </div>
    </div>
  );
};

export default TaxableIncome;
