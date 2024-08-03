import './incomeStyles/AnalysisAndTips.css';

const averageMonthlySalary = 2678;
const averageHourlyWage = 15.48;
const averageWeeklyHours = 40;

const calculateSalaryAnalysis = (monthlySalary, hpw) => {
  const annualSalary = monthlySalary * 12;
  const weeklySalary = monthlySalary / 4.33;
  const hourlySalary = weeklySalary / hpw;

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
  const analysis = calculateSalaryAnalysis(user.monthlySalary, user.hpw);
  const tips = generateTips(analysis, user);

  return (
    <div className="analysis-tips">
      <h2>Salary Analysis</h2>
      <div className="salary-analysis">
        <ul>
          <li>Annual Salary: €{analysis.annualSalary.toFixed(2)}</li>
          <li>Monthly Salary: €{analysis.monthlySalary.toFixed(2)}</li>
          <li>Weekly Salary: €{analysis.weeklySalary.toFixed(2)}</li>
          <li>Hourly Salary: €{analysis.hourlySalary.toFixed(2)}</li>
        </ul>
        <h4>Comparison with Average:</h4>
        <ul>
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

      <h2>Financial Tips</h2>
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
