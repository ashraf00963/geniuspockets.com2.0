import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPocketsAsync, updatePocketAsync, deletePocketAsync } from '../../redux/slices/pocketSlice';
import CreatePocketPopup from './CreatePocketPopup'; 
import PocketDetailPopup from './PocketDetailPopup'; 
import PocketItem from './PocketItem';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './PocketsStyles/PocketsSection.css';

const PocketsSection = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [filter, setFilter] = useState('active'); 
    const [selectedPocket, setSelectedPocket] = useState(null); 
    const dispatch = useDispatch();
    const pockets = useSelector((state) => state.pockets.pockets);
    const { t } = useTranslation('pocketsPage'); // Assuming the namespace is 'pocketsPage'

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
        if (updatedPocket && updatedPocket.id) {
            dispatch(updatePocketAsync(updatedPocket));
            setSelectedPocket(null);
        }
    };     

    const handleDeletePocket = (pocketId) => {
        dispatch(deletePocketAsync(pocketId));
        setSelectedPocket(null);
    };

    const filteredPockets = pockets.filter(pocket => pocket.status === filter);

    return (
        <div className="pockets-section">
            <div className="pockets-header">
                <h3>{t('pocketsTitle')}</h3>
                <button onClick={handleCreatePocketClick} className="create-pocket-button">
                    {t('createNewPocket')}
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

            <div className="filter-buttons">
                <button 
                    className={filter === 'active' ? 'active-filter' : ''} 
                    onClick={() => setFilter('active')}
                >
                    {t('active')}
                </button>
                <button 
                    className={filter === 'completed' ? 'active-filter' : ''} 
                    onClick={() => setFilter('completed')}
                >
                    {t('completed')}
                </button>
                <button 
                    className={filter === 'unsuccessful' ? 'active-filter' : ''} 
                    onClick={() => setFilter('unsuccessful')}
                >
                    {t('unsuccessful')}
                </button>
            </div>

            <div className="pockets-list">
                {filteredPockets.length > 0 ? (
                    filteredPockets.map((pocket) => (
                        <PocketItem key={pocket.id} pocket={pocket} onClick={handlePocketClick} />
                    ))
                ) : (
                    <p>{t('noPocketsFound')}</p>
                )}
            </div>
        </div>
    );
};

export default PocketsSection;
