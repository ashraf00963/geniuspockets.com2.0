import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './PocketsStyles/PocketDetailPopup.css';

const PocketDetailPopup = ({ pocket, onClose, onEdit, onDelete }) => {
    const { t } = useTranslation('pocketsPage'); // Assuming 'pocketsPage' is your translation namespace
    const [name, setName] = useState(pocket.name);
    const [goalAmount, setGoalAmount] = useState(pocket.goal_amount);
    const [deadline, setDeadline] = useState(pocket.deadline);

    const handleSave = () => {
        const updatedPocket = { ...pocket, name, goal_amount: goalAmount, deadline };
        onEdit(updatedPocket);
    };

    const handleDelete = () => {
        if (window.confirm(t('confirmDelete'))) {
            onDelete(pocket.id);
        }
    };

    return (
        <div className="pocket-detail-popup">
            <div className="popup-detail-content">
                <h3>{t('pocketDetails')}</h3>
                <div className="form-group">
                    <label>{t('pocketName')}</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>{t('goalAmount')}</label>
                    <input 
                        type="number" 
                        value={goalAmount} 
                        onChange={(e) => setGoalAmount(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>{t('deadline')}</label>
                    <input 
                        type="date" 
                        value={deadline.split('T')[0]} 
                        onChange={(e) => setDeadline(e.target.value)} 
                    />
                </div>
                <div className="details-form-actions">
                    <button onClick={onClose} className="cancel-button">{t('cancel')}</button>
                    <button onClick={handleSave} className="save-button">{t('save')}</button>
                    <button onClick={handleDelete} className="delete-button">{t('delete')}</button>
                </div>
            </div>
        </div>
    );
};

export default PocketDetailPopup;
