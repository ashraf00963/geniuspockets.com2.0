import './incomeStyles/AnalysisAndTips.css';

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
    tips.push(
      `Your monthly salary is below the average in Germany by €${Math.abs(
        analysis.monthlyDifference.toFixed(2)
      )} (${Math.abs(
        analysis.monthlyPercentage.toFixed(2)
      )}%). Consider negotiating your salary or seeking new opportunities.`
    );
  } else {
    tips.push(
      `Your monthly salary is above the average in Germany. Consider investing or saving more to secure your financial future.`
    );
  }

  if (user.hpw > averageWeeklyHours) {
    tips.push(
      `You are working more than the average ${averageWeeklyHours} hours per week. Consider work-life balance strategies to prevent burnout.`
    );
  }

  if (analysis.monthlyPercentage < 0 || user.hpw > averageWeeklyHours) {
    tips.push(
      `Switching jobs can lead to an average salary increase of 20%. Explore opportunities that align with your skills and interests.`
    );
  }

  tips.push(
    `Upskilling or reskilling can increase your salary by up to 15%. Consider online courses to enhance your career prospects.`
  );

  if (user.passiveIncome > 0) {
    tips.push(
      `You have a passive income stream. Consider diversifying your income sources for greater financial stability.`
    );
  } else {
    tips.push(
      `Explore passive income opportunities like investments or freelancing to increase your overall income.`
    );
  }

  return tips;
};

const SalaryAnalysisAndTips = ({ user }) => {
  // Ensure user data is available
  if (!user || typeof user.monthlySalary !== 'number' || typeof user.hpw !== 'number') {
    return <p>No valid salary data available</p>;
  }

  const analysis = calculateSalaryAnalysis(user.monthlySalary, user.hpw);

  if (!analysis) {
    return <p>Insufficient data for analysis</p>;
  }

  const tips = generateTips(analysis, user);

  // Format the total balance using European number formatting
  const EuroFormat = (m) => {
    const fixedM = m.toFixed(2)
    const result = new Intl.NumberFormat('de-DE').format(fixedM ?? 0);
    return result;
  }

  return (
    <div className="analysis-tips">
      <h2>Salary Analysis</h2>
      <div className="salary-analysis">
        <ul>
          <li>Annual Salary <span className='annual-salary'>{EuroFormat(analysis.annualSalary)}€</span></li>
          <li>Monthly Salary <span className='monthly-salary'>{EuroFormat(analysis.monthlySalary)}€</span></li>
          <li>Weekly Salary <span className='weekly-salary'>{EuroFormat(analysis.weeklySalary)}€</span></li>
          <li>Hourly Salary <span className='hourly-salary'>{EuroFormat(analysis.hourlySalary)}€</span></li>
        </ul>
        <h4>Comparison with Average:</h4>
        <ul className='compare-average'>
          <li>
            Monthly Difference: €{analysis.monthlyDifference.toFixed(2)} (
            {analysis.monthlyPercentage.toFixed(2)}%)
          </li>
          <li>
            Hourly Difference: €{analysis.hourlyDifference.toFixed(2)} (
            {analysis.hourlyPercentage.toFixed(2)}%)
          </li>
        </ul>
      </div>

      <h2 className='analysis-second-h'>Financial Tips</h2>
      <div className="tips">
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SalaryAnalysisAndTips;
