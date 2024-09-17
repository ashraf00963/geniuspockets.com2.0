import React from 'react';
import SemiCircleChartWrapper from '../../utils/SemiCircleChart.jsx';
import goal from '../../assets/goal.webp';
import deadline from '../../assets/deadline.webp';
import piggyBank from '../../assets/savedAmount.webp';
import { formatDateToGerman } from '../../utils/formatUtils.js';

const PocketItem = ({ pocket, onClick }) => {
    if (!pocket) {
        return null;
    }
    
    const goalPercentage = (pocket.saved_amount / pocket.goal_amount) * 100;
    const deadlinePercentage = calculateDeadlinePercentage(pocket);

    return (
        <div className="pocket-item" onClick={() => onClick(pocket)}>
            <div className="pocket-info">
                <h4>{pocket.name}</h4>
                <div className="pocket-details">
                    <div className="pocket-goal">
                        <img className="pocket-item-icons" src={goal} alt='flag on a mountain' />
                        <span>{pocket.goal_amount.toLocaleString()}€</span>
                    </div>
                    <div className="pocket-saved">
                        <img className="pocket-item-icons" src={piggyBank} alt='piggy bank' />
                        <span>{pocket.saved_amount.toLocaleString()}€</span>
                    </div>
                    <div className="pocket-deadline">
                        <img className="pocket-item-icons" src={deadline} alt='sand watch' />
                        <span>{formatDateToGerman(pocket.deadline)}</span>
                    </div>
                </div>
            </div>
            <SemiCircleChartWrapper goalPercentage={goalPercentage} deadlinePercentage={deadlinePercentage} />
        </div>
    );
};

const calculateDeadlinePercentage = (pocket) => {
    const now = new Date();
    const deadline = new Date(pocket.deadline);
    const createdAt = new Date(pocket.created_at);

    if (isNaN(createdAt.getTime()) || isNaN(deadline.getTime())) {
        console.error("Invalid dates detected!");
        return 0;
    }

    const totalTime = deadline - createdAt;
    const timePassed = now - createdAt;

    const percentage = (timePassed / totalTime) * 100;
    return Math.round(percentage);
};

export default PocketItem;
