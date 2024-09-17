import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumberToGerman } from '../../utils/formatUtils';
import { getTypeColors } from '../../utils/colorUtils';
import './expenseStyles/ExpensesAnalysis.css';

const ExpensesAnalysis = ({ expenses }) => {
  const { t } = useTranslation('expensesPage');
  const [tips, setTips] = useState([]);

  // Predefined types for translation
  const predefinedTypes = ['groceries', 'rent', 'utilities', 'subscriptions', 'entertainment', 'work-related', 'medical', 'charitable-donations'];

  const totalPerType = expenses.reduce((acc, expense) => {
    const type = expense.type.toLowerCase();
    acc[type] = (acc[type] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const averageSpending = {
    groceries: 200,
    rent: 1200,
    utilities: 280,
    subscriptions: 50,
    entertainment: 150,
  };

  const generateTips = () => {
    const tipsList = [];

    if (!totalPerType || Object.keys(totalPerType).length === 0) {
        return;
    }

    Object.keys(totalPerType).forEach((type) => {
        const userAmount = totalPerType[type] || 0;
        const averageAmount = averageSpending[type.toLowerCase()] || 0;

        if (averageAmount === 0) {
            console.log(`No average data for ${type}.`);
            return;
        }

        const difference = userAmount - averageAmount;

        if (userAmount > averageAmount) {
            tipsList.push({
                type: type,
                tip: t(`tips.${type}Higher`), 
            });
        } else if (userAmount < averageAmount) {
            tipsList.push({
                type: type,
                tip: t(`tips.${type}Lower`), 
            });
        }
    });

    setTips(tipsList);
  };

  useEffect(() => {
    if (expenses.length > 0) {
      generateTips(); // Only run if there are expenses
    }
  }, [expenses]);

  const expenseTypes = Object.keys(totalPerType);
  const typeColors = getTypeColors(expenseTypes);

  return (
    <div className="expenses-analysis">
      <div className="expenses-overview">
        <h2>{t('expensesAnalysis')}</h2>
        <h3>{t('yourExpensesByType')}</h3>
        <ul>
          {Object.entries(totalPerType).map(([type, amount]) => (
            <li key={type}>
              <strong style={{ color: typeColors[type] }}>
                {/* Check if type exists in predefinedTypes array */}
                {predefinedTypes.includes(type) ? t(`expenseTypes.${type}`) : type}
              </strong> 
              €{formatNumberToGerman(amount)}
            </li>
          ))}
        </ul>
      </div>

      <div className="expenses-comparison">
        <h3>{t('comparisonWithAverage')}</h3>
        <ul>
          {Object.entries(totalPerType).map(([type, amount]) => {
            const averageAmount = averageSpending[type] || 0;
            const difference = amount - averageAmount;
            const percentage = averageAmount > 0 ? ((difference / averageAmount) * 100).toFixed(2) : 0;

            return (
              <li key={type}>
                <strong style={{ color: typeColors[type] }}>
                  {/* Check if type exists in predefinedTypes array */}
                  {predefinedTypes.includes(type) ? t(`expenseTypes.${type}`) : type}
                </strong><br/>
                {t('youSpent', { amount: formatNumberToGerman(amount), averageAmount: formatNumberToGerman(averageAmount) })}<br/>
                {t('differenceFromAverage', { difference: difference >= 0 ? '€' + difference.toLocaleString() : '€' + Math.abs(difference).toLocaleString(), percentage, direction: difference >= 0 ? t('more') : t('less') })}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="expenses-tips">
        <h3>{t('tipsLabel')}</h3>
        <ul>
            {tips.length > 0 ? (
                tips.map(({ type, tip }, index) => (
                    <li key={index}>
                        <strong style={{ color: typeColors[type] }}>
                          {/* Check if type exists in predefinedTypes array */}
                          {predefinedTypes.includes(type) ? t(`expenseTypes.${type}`) : type}
                        </strong><br/> 
                        {tip}
                    </li>
                ))
            ) : (
                <p>{t('noTipsAvailable')}</p>
            )}
        </ul>
      </div>
    </div>
  );
};

export default ExpensesAnalysis;
