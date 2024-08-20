import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPocketsAsync, updatePocketAsync, deletePocketAsync } from '../../redux/slices/pocketSlice';
import CreatePocketPopup from './CreatePocketPopup'; 
import PocketDetailPopup from './PocketDetailPopup';  // Import the detail popup component
import PocketItem from './PocketItem';
import './PocketsStyles/PocketsSection.css';

const PocketsSection = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [filter, setFilter] = useState('active'); // State for the selected filter
    const [selectedPocket, setSelectedPocket] = useState(null); // State for the selected pocket
    const dispatch = useDispatch();
    const pockets = useSelector((state) => state.pockets.pockets);

    useEffect(() => {
        dispatch(fetchPocketsAsync());
    }, [dispatch]);

    const handleCreatePocketClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handlePocketClick = (pocket) => {
        setSelectedPocket(pocket);
    };

    const handleCloseDetailPopup = () => {
        setSelectedPocket(null);
    };

    const handleEditPocket = (updatedPocket) => {
        // Check if updatedPocket is valid and has an id
        if (updatedPocket && updatedPocket.id) {
            dispatch(updatePocketAsync(updatedPocket));
            setSelectedPocket(null);
        }
    };     

    const handleDeletePocket = (pocketId) => {
        dispatch(deletePocketAsync(pocketId));
        setSelectedPocket(null);
    };

    // Filter pockets based on selected filter
    const filteredPockets = pockets.filter(pocket => pocket.status === filter);

    return (
        <div className="pockets-section">
            <div className="pockets-header">
                <h3>Pockets</h3>
                <button onClick={handleCreatePocketClick} className="create-pocket-button">
                    Create new pocket
                </button>
            </div>
            {isPopupOpen && <CreatePocketPopup onClose={handleClosePopup} />}
            {selectedPocket && (
                <PocketDetailPopup 
                    pocket={selectedPocket} 
                    onClose={handleCloseDetailPopup} 
                    onEdit={handleEditPocket} 
                    onDelete={handleDeletePocket}
                />
            )}

            {/* Filter Buttons */}
            <div className="filter-buttons">
                <button 
                    className={filter === 'active' ? 'active-filter' : 'active'} 
                    onClick={() => setFilter('active')}
                >
                    Active
                </button>
                <button 
                    className={filter === 'completed' ? 'active-filter' : 'completed'} 
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
                <button 
                    className={filter === 'unsuccessful' ? 'active-filter' : 'unsuccessful'} 
                    onClick={() => setFilter('unsuccessful')}
                >
                    Unsuccessful
                </button>
            </div>

            <div className="pockets-list">
                {filteredPockets.length > 0 ? (
                    filteredPockets.map((pocket) => (
                        <PocketItem key={pocket.id} pocket={pocket} onClick={handlePocketClick} />
                    ))
                ) : (
                    <p>No pockets found for this status.</p>
                )}
            </div>
        </div>
    );
};

export default PocketsSection;
