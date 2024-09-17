import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './PocketsStyles/PocketsAnalysis.css';

const PocketsAnalysis = () => {
    const { t } = useTranslation('pocketsPage'); // Assuming the namespace is 'pocketsPage'
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
            return diffDays <= 365;
        }).length;

        const longTermPockets = totalPockets - shortTermPockets;

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
                activePockets,
                completedPockets,
                unsuccessfulPockets
            })
        };

        setAnalysis(analysisData);
    };

    const generateTips = ({ availableBalance, unsuccessfulPercentage, shortTermPockets, longTermPockets, activePockets, completedPockets, unsuccessfulPockets }) => {
        const tips = [];
    
        if (unsuccessfulPercentage > 20) {
            tips.push(t('tips.focusOnFewerGoals'));
        }
    
        if (availableBalance < 500) {
            tips.push(t('tips.lowBalance'));
        } else if (availableBalance > 5000) {
            tips.push(t('tips.highBalance'));
        }
    
        if (shortTermPockets > longTermPockets) {
            tips.push(t('tips.shortTermFocus'));
        } else if (longTermPockets > shortTermPockets) {
            tips.push(t('tips.longTermFocus'));
        }
    
        if (activePockets > 5) {
            tips.push(t('tips.tooManyActiveGoals'));
        }
    
        if (completedPockets > 0) {
            tips.push(t('tips.celebrateSuccess', { count: completedPockets }));
        }
    
        if (availableBalance > 1000 && activePockets > 0) {
            tips.push(t('tips.automaticSavings'));
        }
    
        if (unsuccessfulPockets > 0) {
            tips.push(t('tips.reviewGoals'));
        }
    
        return tips;
    };    

    return (
        <div className="pockets-analysis">
            {analysis && (
                <>
                    <h3>{t('pocketsAnalysis')}</h3>
                    <div className="analysis-overview">
                        <p>{t('totalPockets')}: {analysis.totalPockets}</p>
                        <p>{t('activePockets')}: {analysis.activePockets}</p>
                        <p>{t('completedPockets')}: {analysis.completedPockets}</p>
                        <p>{t('unsuccessfulPockets')}: {analysis.unsuccessfulPockets}</p>
                        <p>{t('shortTermPockets')}: {analysis.shortTermPockets}</p>
                        <p>{t('longTermPockets')}: {analysis.longTermPockets}</p>
                    </div>
                    <div className="tips">
                        <h4>{t('tipsLabel')}</h4>
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
