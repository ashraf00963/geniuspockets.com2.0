import React, { useState } from 'react';
import './PocketsStyles/PocketDetailPopup.css';

const PocketDetailPopup = ({ pocket, onClose, onEdit, onDelete }) => {
    const [name, setName] = useState(pocket.name);
    const [goalAmount, setGoalAmount] = useState(pocket.goal_amount);
    const [deadline, setDeadline] = useState(pocket.deadline);

    const handleSave = () => {
        const updatedPocket = { ...pocket, name, goal_amount: goalAmount, deadline };
        onEdit(updatedPocket);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this pocket?")) {
            onDelete(pocket.id);
        }
    };

    return (
        <div className="pocket-detail-popup">
            <div className="popup-detail-content">
                <h3>Pocket Details</h3>
                <div className="form-group">
                    <label>Pocket Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Goal Amount</label>
                    <input 
                        type="number" 
                        value={goalAmount} 
                        onChange={(e) => setGoalAmount(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Deadline</label>
                    <input 
                        type="date" 
                        value={deadline.split('T')[0]} 
                        onChange={(e) => setDeadline(e.target.value)} 
                    />
                </div>
                <div className="details-form-actions">
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                    <button onClick={handleSave} className="save-button">Save</button>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default PocketDetailPopup;
