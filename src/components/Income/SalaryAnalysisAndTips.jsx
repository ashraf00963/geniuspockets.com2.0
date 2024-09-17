import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumberToGerman } from '../../utils/formatUtils';
import './incomeStyles/AnalysisAndTips.css';

const SalaryAnalysisAndTips = ({ user }) => {
  const { t } = useTranslation('incomePage');

  const averageMonthlySalary = 2678;
  const averageHourlyWage = 15.48;
  const averageWeeklyHours = 40;

  // Function to calculate salary analysis
  const calculateSalaryAnalysis = (monthlySalary, hpw) => {
    if (!monthlySalary || !hpw) {
      return null;
    }

    const annualSalary = monthlySalary * 12;
    const weeklySalary = monthlySalary / 4.33;
    const hourlySalary = hpw > 0 ? weeklySalary / hpw : 0;

    const monthlyDifference = monthlySalary - averageMonthlySalary;
    const hourlyDifference = hourlySalary - averageHourlyWage;

    const monthlyPercentage = (monthlyDifference / averageMonthlySalary) * 100;
    const hourlyPercentage = (hourlyDifference / averageHourlyWage) * 100;

    return {
      annualSalary,
      monthlySalary,
      weeklySalary,
      hourlySalary,
      monthlyDifference,
      hourlyDifference,
      monthlyPercentage,
      hourlyPercentage,
    };
  };

  // Function to generate financial tips
  const generateTips = (analysis, user) => {
    const tips = [];

    if (analysis.monthlyPercentage < 0) {
      tips.push(t('tips.monthlySalaryBelowAverage', {
        amount: Math.abs(analysis.monthlyDifference.toFixed(2)),
        percentage: Math.abs(analysis.monthlyPercentage.toFixed(2))
      }));
    } else {
      tips.push(t('tips.monthlySalaryAboveAverage'));
    }

    if (user.hpw > averageWeeklyHours) {
      tips.push(t('tips.workingMoreHours', { averageWeeklyHours }));
    }

    if (analysis.monthlyPercentage < 0 || user.hpw > averageWeeklyHours) {
      tips.push(t('tips.jobSwitching'));
    }

    tips.push(t('tips.upskilling'));

    if (user.passiveIncome > 0) {
      tips.push(t('tips.hasPassiveIncome'));
    } else {
      tips.push(t('tips.noPassiveIncome'));
    }

    return tips;
  };

  // Ensure user data is available
  if (!user || typeof user.monthlySalary !== 'number' || typeof user.hpw !== 'number') {
    return <p>{t('noValidSalaryData')}</p>;
  }

  const analysis = calculateSalaryAnalysis(user.monthlySalary, user.hpw);

  if (!analysis) {
    return <p>{t('insufficientData')}</p>;
  }

  const tips = generateTips(analysis, user);

  return (
    <div className="analysis-tips">
      <div className="salary-analysis">
        <h2>{t('salaryAnalysis')}</h2>
        <ul>
          <li>{t('annualSalary')} <span className='annual-salary'>{formatNumberToGerman(analysis.annualSalary)}€</span></li>
          <li>{t('monthlySalary')} <span className='monthly-salary'>{formatNumberToGerman(analysis.monthlySalary)}€</span></li>
          <li>{t('weeklySalary')} <span className='weekly-salary'>{formatNumberToGerman(analysis.weeklySalary)}€</span></li>
          <li>{t('hourlySalary')} <span className='hourly-salary'>{formatNumberToGerman(analysis.hourlySalary)}€</span></li>
        </ul>
        <h4>{t('comparisonWithAverage')}</h4>
        <ul className='compare-average'>
          <li>
            {t('yourMonthlySalaryIs', {
              comparison: analysis.monthlyDifference >= 0 ? t('above') : t('below'),
              amount: formatNumberToGerman(analysis.monthlyDifference),
              percentage: Math.abs(analysis.monthlyPercentage).toFixed(2)
            })}
          </li>
          <li>
            {t('yourHourlyWageIs', {
              comparison: analysis.hourlyDifference >= 0 ? t('above') : t('below'),
              amount: formatNumberToGerman(analysis.hourlyDifference),
              percentage: Math.abs(analysis.hourlyPercentage).toFixed(2)
            })}
          </li>
        </ul>
      </div>
      <div className='analysis-second'>
        <h2 className='analysis-second-h'>{t('financialTips')}</h2>
        <div className="tips">
          <ul>
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SalaryAnalysisAndTips;
