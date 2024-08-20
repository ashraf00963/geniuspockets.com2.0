import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './PocketsStyles/PocketsAnalysis.css';

const PocketsAnalysis = () => {
    const pockets = useSelector((state) => state.pockets.pockets);
    const availableBalance = useSelector((state) => state.availableBalance.balance);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        analyzePockets();
    }, [pockets, availableBalance]);

    const analyzePockets = () => {
        const totalPockets = pockets.length;
        const activePockets = pockets.filter(pocket => pocket.status === 'active').length;
        const completedPockets = pockets.filter(pocket => pocket.status === 'completed').length;
        const unsuccessfulPockets = pockets.filter(pocket => pocket.status === 'unsuccessful').length;
        const unsuccessfulPercentage = (unsuccessfulPockets / totalPockets) * 100;

        const shortTermPockets = pockets.filter(pocket => {
            const deadline = new Date(pocket.deadline);
            const now = new Date();
            const diffTime = Math.abs(deadline - now);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 365; // Consider short term as within a year
        }).length;

        const longTermPockets = totalPockets - shortTermPockets;

        // Generate analysis
        const analysisData = {
            totalPockets,
            activePockets,
            completedPockets,
            unsuccessfulPockets,
            unsuccessfulPercentage,
            shortTermPockets,
            longTermPockets,
            tips: generateTips({
                availableBalance,
                unsuccessfulPercentage,
                shortTermPockets,
                longTermPockets,
                activePockets
            })
        };

        setAnalysis(analysisData);
    };

    const generateTips = ({ availableBalance, unsuccessfulPercentage, shortTermPockets, longTermPockets, activePockets, completedPockets, unsuccessfulPockets }) => {
        const tips = [];
    
        // Tip 1: Focus on fewer goals if there are too many unsuccessful pockets
        if (unsuccessfulPercentage > 20) {
            tips.push(
                "You have several goals that didn't go as planned. Consider prioritizing fewer, more achievable goals. Focus on what's most important to you and allocate resources accordingly."
            );
        }
    
        // Tip 2: Build an emergency fund if the balance is low
        if (availableBalance < 500) {
            tips.push(
                "Your available balance is low. It's crucial to have an emergency fund that covers 3-6 months of expenses. Start by setting aside a small amount each month to build this safety net."
            );
        } else if (availableBalance > 5000) {
            tips.push(
                "You have a healthy available balance! Consider putting some of it into a high-yield savings account or investing it in a diversified portfolio to grow your wealth over time."
            );
        }
    
        // Tip 3: Short-term vs. Long-term balance
        if (shortTermPockets > longTermPockets) {
            tips.push(
                "You have more short-term goals. Ensure you're not sacrificing long-term savings for immediate needs. Balance your goals by setting up a long-term investment plan, such as retirement savings."
            );
        } else if (longTermPockets > shortTermPockets) {
            tips.push(
                "You have a strong focus on long-term goals. This is great! Just make sure to keep some liquidity for short-term needs and unexpected expenses."
            );
        }
    
        // Tip 4: Too many active pockets
        if (activePockets > 5) {
            tips.push(
                "Managing multiple goals at once can be overwhelming. Try consolidating some of your pockets into broader categories to simplify your savings strategy. For example, merge similar goals like 'Vacation' and 'Weekend Getaway' into one 'Travel Fund.'"
            );
        }
    
        // Tip 5: Celebrate small wins
        if (completedPockets > 0) {
            tips.push(
                `You've successfully completed ${completedPockets} goal(s)! Take a moment to celebrate your progress. Consider using this momentum to start your next goal or add to an existing one.`
            );
        }
    
        // Tip 6: Automatic savings
        if (availableBalance > 1000 && activePockets > 0) {
            tips.push(
                "With your current balance, it's a good idea to set up automatic transfers into your pockets. Automating your savings ensures consistent progress toward your goals without requiring you to think about it."
            );
        }
    
        // Tip 7: Review and adjust goals
        if (unsuccessfulPockets > 0) {
            tips.push(
                "Some of your goals didn't work out. Take time to review these goals—were they realistic? What challenges did you face? Adjust your future goals based on these learnings."
            );
        }
    
        return tips;
    };    

    return (
        <div className="pockets-analysis">
            {analysis && (
                <>
                    <h3>Pockets Analysis</h3>
                    <div className="analysis-overview">
                        <div className='analysis-overview-first'>
                            <p>Total Pockets: {analysis.totalPockets}</p>
                            <p>Active Pockets: {analysis.activePockets}</p>
                            <p>Completed Pockets: {analysis.completedPockets}</p>
                        </div>
                        <div className='analysis-overview-second'>
                            <p>Unsuccessful Pockets: {analysis.unsuccessfulPockets}</p>
                            <p>Short-Term Pockets: {analysis.shortTermPockets}</p>
                            <p>Long-Term Pockets: {analysis.longTermPockets}</p>
                        </div>
                    </div>
                    <div className="tips">
                        <h4>Tips</h4>
                        <ul>
                            {analysis.tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default PocketsAnalysis;
