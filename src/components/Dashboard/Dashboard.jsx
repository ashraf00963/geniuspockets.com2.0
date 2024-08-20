import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateSession } from '../../redux/slices/authSlice';
import TotalBalance from './Balance/TotalBalance';
import './dashboardStyles/Dashboard.css';
import Charts from './charts/Charts';
import RecentTransactions from './RecentTransactions';
import LastActivePockets from './LastActivePockets';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatch(validateSession()); // Validate session to ensure user is authenticated
    }
  }, [dispatch, user]);

  // Check if the user is authenticated
  if (!user) {
    return <p>Loading...</p>; // Or redirect to login page
  }

  return (
    <div className="dashboard">
      <div className="dashboard-sections">
        <TotalBalance user_id={user.id} />
        <Charts />
        <RecentTransactions />
        <LastActivePockets />
        {/* Additional components like IncomeSummary, ExpenseSummary, etc., can be added here */}
      </div>
    </div>
  );
};

export default Dashboard;
