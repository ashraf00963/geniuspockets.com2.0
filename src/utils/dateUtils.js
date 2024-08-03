// src/utils/dateUtils.js

export const getDateRange = (timeFrame, referenceDate = new Date()) => {
    let startDate;
    let endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 23, 59, 59, 999);
    let display = '';
  
    switch (timeFrame) {
      case 'week':
        startDate = new Date(referenceDate);
        startDate.setDate(referenceDate.getDate() - referenceDate.getDay() + 1); // Start on Monday
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End on Sunday
        display = `Week of ${startDate.toLocaleDateString()}`;
        break;
      case 'month':
        startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
        endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
        display = startDate.toLocaleString('default', { month: 'long' });
        break;
      case 'year':
        startDate = new Date(referenceDate.getFullYear(), 0, 1);
        endDate = new Date(referenceDate.getFullYear(), 11, 31);
        display = startDate.getFullYear().toString();
        break;
      default:
        startDate = new Date(referenceDate);
        startDate.setDate(referenceDate.getDate() - referenceDate.getDay() + 1);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        display = `Week of ${startDate.toLocaleDateString()}`;
    }
  
    return { startDate, endDate, display };
  };
  
  export const adjustDateRange = (currentRange, timeFrame, direction) => {
    let referenceDate;
    const adjustment = direction === 'next' ? 1 : -1;
  
    switch (timeFrame) {
      case 'week':
        referenceDate = new Date(currentRange.startDate);
        referenceDate.setDate(referenceDate.getDate() + adjustment * 7);
        break;
      case 'month':
        referenceDate = new Date(currentRange.startDate);
        referenceDate.setMonth(referenceDate.getMonth() + adjustment);
        break;
      case 'year':
        referenceDate = new Date(currentRange.startDate);
        referenceDate.setFullYear(referenceDate.getFullYear() + adjustment);
        break;
      default:
        referenceDate = new Date(currentRange.startDate);
        referenceDate.setDate(referenceDate.getDate() + adjustment * 7);
    }
  
    return getDateRange(timeFrame, referenceDate);
  };
  