import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Importer le composant Modal

const JoinRoom = ({ slotTypes }) => {
    const [formData, setFormData] = useState({
        slotTypeId: '',
        instrumentId: ''
    });

    const [availableInstruments, setAvailableInstruments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(true); // Gérer l'état d'ouverture de la modale

    // Fonction pour récupérer les join_room via l'API
    const fetchInstruments = (slotTypeId) => {
        fetch(`/api/v1/join_room/by_slot_type?slot_type_id=${slotTypeId}`)
            .then(response => response.json())
            .then(data => setAvailableInstruments(data))
            .catch(error => console.error('Error fetching join_room:', error));
    };

    // Effet pour charger les join_room quand le SlotTypeId change
    useEffect(() => {
        if (formData.slotTypeId) {
            fetchInstruments(formData.slotTypeId);
        } else {
            setAvailableInstruments([]);
        }
    }, [formData.slotTypeId]);

    // Handler pour les changements dans les champs du formulaire
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handler pour la soumission du formulaire
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form data:', formData);
    };

    return (
        <div>


            <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="slotType">Slot Type:</label>
                        <select
                            id="slotType"
                            name="slotTypeId"
                            value={formData.slotTypeId}
                            onChange={handleChange}
                        >
                            <option value="">Select Slot Type</option>
                            {slotTypes.map(slot => (
                                <option key={slot.id} value={slot.id}>
                                    {slot.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="instrument">Instrument:</label>
                        <select
                            id="instrument"
                            name="instrumentId"
                            value={formData.instrumentId}
                            onChange={handleChange}
                        >
                            <option value="">Select Instrument</option>
                            {availableInstruments.map(instrument => (
                                <option key={instrument.id} value={instrument.id}>
                                    {instrument.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">Play</button>
                    <bouton type="cancel">Join as spectator</bouton>

                </form>
            </Modal>
        </div>
    );
};

export default JoinRoom;
