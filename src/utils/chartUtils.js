export const generateBarChartLabels = (timeFrame, currentRange) => {
    const labels = [];
    if (timeFrame === 'week') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentRange.startDate);
            date.setDate(currentRange.startDate.getDate() + i);
            labels.push(`${days[i]} ${date.getDate()}`);
        }
    } else if (timeFrame === 'month') {
        labels.push('Week 1', 'Week 2', 'Week 3', 'Week 4');
    } else if (timeFrame === 'year') {
        labels.push('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    }
    return labels;
};

export const aggregateData = (data, currentRange, timeFrame, type, dateField) => {
    const aggregatedData = [];
    const startDate = new Date(currentRange.startDate);
    const endDate = new Date(currentRange.endDate);

    if (timeFrame === 'week') {
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const filteredData = data.filter((item) => new Date(item[dateField]).toLocaleDateString() === date.toLocaleDateString() && item.type === type);
            aggregatedData.push(filteredData.reduce((sum, item) => sum + parseFloat(item.amount), 0));
        }
    } else if (timeFrame === 'month') {
        for (let i = 0; i < 4; i++) {
            const weekStart = new Date(startDate);
            weekStart.setDate(startDate.getDate() + i * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            const filteredData = data.filter((item) => new Date(item[dateField]) >= weekStart && new Date(item[dateField]) <= weekEnd && item.type === type);
            aggregatedData.push(filteredData.reduce((sum, item) => sum + parseFloat(item.amount), 0));
        }
    } else if (timeFrame === 'year') {
        for (let i = 0; i < 12; i++) {
            const filteredData = data.filter((item) => new Date(item[dateField]).getMonth() === i && item.type === type);
            aggregatedData.push(filteredData.reduce((sum, item) => sum + parseFloat(item.amount), 0));
        }
    }

    return aggregatedData;
};
