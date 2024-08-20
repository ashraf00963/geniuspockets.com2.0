import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const LineChart = ({ data }) => {
    let cumulativeBalance = 0;

    const labels = data.map(transaction =>
        new Date(transaction.transaction_date).toISOString().slice(0, 10)
    );

    const balanceData = data.map(transaction => {
        const amount = parseFloat(transaction.amount);

        if (transaction.transaction_type === 'deposit') {
            cumulativeBalance += amount;
        } else if (transaction.transaction_type === 'withdrawal') {
            cumulativeBalance -= amount;
        }

        return cumulativeBalance;
    });

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Balance',
                data: balanceData,
                borderColor: 'transparent', // This won't be used due to custom coloring
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true,
                tension: 0.1,
                pointRadius: 3,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            customLineColor: {
                id: 'customLineColor',
                afterDatasetsDraw: (chart) => {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((point, index) => {
                            if (index === 0) return; // Skip the first point

                            const prevPoint = meta.data[index - 1];
                            const currentPoint = point;

                            ctx.save();

                            // Determine the color based on the direction of the line
                            if (currentPoint.y < prevPoint.y) {
                                ctx.strokeStyle = '#36a2eb';
                            } else {
                                ctx.strokeStyle = '#ff6384';
                            }

                            ctx.beginPath();
                            ctx.moveTo(prevPoint.x, prevPoint.y);
                            ctx.lineTo(currentPoint.x, currentPoint.y);
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            ctx.restore();
                        });
                    });
                },
            },
        },
        scales: {
            x: {
                display: false,
                ticks: {
                    callback: function (value, index) {
                        const date = new Date(chartData.labels[index]);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        return `${day}.${month}`;
                    },
                    color: '#ddd',
                },
            },
            y: {
                display: true,
                ticks: {
                    callback: function (value) {
                        return value + '€';
                    },
                    color: '#ddd',
                },
            },
        },
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '280px' }}>
            <Line data={chartData} options={options} plugins={[options.plugins.customLineColor]} />
        </div>
    );
};

export default LineChart;
