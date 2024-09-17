import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateSession } from '../../redux/slices/authSlice';
import TotalBalance from './Balance/TotalBalance';
import Charts from './charts/Charts';
import RecentTransactions from './RecentTransactions';
import LastActivePockets from './LastActivePockets';
import LoadingOverlay from '../Loading/LoadingOverlay';
import './dashboardStyles/Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  

  useEffect(() => {
    if (!user) {
      dispatch(validateSession()); // Validate session to ensure user is authenticated
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && !authLoading) {
      // Simulate dashboard data loading
      setTimeout(() => {
        setDashboardLoading(false); // Set to false when data is ready
      }, 1000); // Adjust timing as needed
    }
  }, [user, authLoading]);

  const handleLoadingComplete = () => {
    setOverlayVisible(false);
  };

  return (
    <div className="dashboard">
      {overlayVisible && <LoadingOverlay onLoadingComplete={handleLoadingComplete} />}
      <div className="dashboard-sections">
        <TotalBalance user_id={user} />
        <Charts />
        <LastActivePockets />
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;
