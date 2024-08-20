import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPocketsAsync, updatePocketAsync, deletePocketAsync } from '../../redux/slices/pocketSlice';
import PocketDetailPopup from '../Pockets/PocketDetailPopup';
import PocketItem from '../Pockets/PocketItem'; // Import PocketItem component
import './dashboardStyles/LastActivePockets.css';

const LastActivePockets = () => {
    const dispatch = useDispatch();
    const pockets = useSelector((state) => state.pockets.pockets);
    const [selectedPocket, setSelectedPocket] = useState(null);

    useEffect(() => {
        dispatch(fetchPocketsAsync());
    }, [dispatch]);

    // Filter and get the last 3 active pockets
    const activePockets = pockets.filter(pocket => pocket.status === 'active').slice(-3);

    const handlePocketClick = (pocket) => {
        setSelectedPocket(pocket);
    };

    const handleClosePopup = () => {
        setSelectedPocket(null);
    };

    const handleEditPocket = (updatedPocket) => {
        dispatch(updatePocketAsync(updatedPocket));
        setSelectedPocket(null);
    };

    const handleDeletePocket = (pocketId) => {
        dispatch(deletePocketAsync(pocketId));
        setSelectedPocket(null);
    };

    return (
        <div className="last-active-pockets">
            <h3>Last 3 Active Pockets</h3>
            <div className="pocket-list">
                {activePockets.map(pocket => (
                    <PocketItem 
                        key={pocket.id} 
                        pocket={pocket} 
                        onClick={handlePocketClick} // Make it clickable to open the popup
                    />
                ))}
            </div>
            {selectedPocket && (
                <PocketDetailPopup 
                    pocket={selectedPocket} 
                    onClose={handleClosePopup} 
                    onEdit={handleEditPocket} 
                    onDelete={handleDeletePocket} 
                />
            )}
        </div>
    );
};

export default LastActivePockets;
