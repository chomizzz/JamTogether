import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const JoinRoom = ({ slotTypes, room }) => {
    const [formData, setFormData] = useState({
        slotTypeId: '',
        instrumentId: '',
        roomId: room.id,
    });

    const [availableInstruments, setAvailableInstruments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(true); // Gérer l'état d'ouverture de la modale
    const [errorMessage, setErrorMessage] = useState(''); // Gérer les erreurs
    const [successMessage, setSuccessMessage] = useState(''); // Gérer les succès
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fonction pour récupérer les join_room via l'API
    const fetchInstruments = async (slotTypeId) => {
        try {
            const response = await fetch(`/api/v1/join_room/fetch_instruments/${slotTypeId}`);
            const data = await response.json();
            setAvailableInstruments(data);
        } catch (error) {
            console.error('Error fetching join_room:', error);
            setAvailableInstruments([]);
        }
    };

    // Effet pour charger les join_room quand le SlotTypeId change
    useEffect(() => {
        if (isClient && formData.slotTypeId) {
            fetchInstruments(formData.slotTypeId);
        }
    }, [formData.slotTypeId, isClient]);


    // Handler pour les changements dans les champs du formulaire
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handler pour la soumission du formulaire
    const handleSubmit = (event) => {
        event.preventDefault();

        const formDataToSend = {
            slotTypeId: formData.slotTypeId,
            instrumentId: formData.instrumentId,
            roomId: formData.roomId,
        };

        fetch(`/rooms/${room.id}/submit_join_form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
            },
            body: JSON.stringify(formDataToSend),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else if (data.error) {
                    setErrorMessage(data.error);
                }
                // else {
                //     setSuccessMessage('Successfully joined the room!');
                //     setIsModalOpen(false);
                // }
            })
            .catch((error) => {
                console.error('Error:', error);
                setErrorMessage('An error occurred. Please try again.');
            });
    };

    // @ts-ignore
    return (
        <div className={""}>
            <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div className={"text-white"}>
                        <label htmlFor="slotType" className={"label"}>Slot Type:</label>
                        <select
                            id="slotType"
                            name="slotTypeId"
                            value={formData.slotTypeId}
                            onChange={handleChange}
                            className={"w-full p-2 border border-slate-600 rounded"}
                        >
                            <option >Select Slot Type</option>
                            {slotTypes.map((slot) => (
                                <option key={slot.id} value={slot.id}>
                                    {slot.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={"text-white"}>
                        <label htmlFor="instrument" className={"label"}>Instrument:</label>
                        <select
                            id="instrument"
                            name="instrumentId"
                            value={formData.instrumentId}
                            onChange={handleChange}
                            className={"w-full p-2 border border-slate-600 rounded"}
                        >
                            <option value="">Select Instrument</option>
                            {availableInstruments.map((instrument) => (
                                <option key={instrument.id} value={instrument.id}>
                                    {instrument.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={"flex justify-center p-4"}>
                        <button type="submit" className={"primary-button"} >Play</button>
                    </div>
                    <div className={"flex justify-center"}>
                        <button onClick={() => window.history.back()}
                                className="cancel-button">
                            Annuler
                        </button>
                    </div>
                </form>

                {/* Afficher les messages de succès ou d'erreur */}
                {errorMessage && <p className="flex justify-center error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </Modal>
        </div>
    );
};

JoinRoom.propTypes = {
    slotTypes: PropTypes.array.isRequired,
    room: PropTypes.object.isRequired,
};

export default JoinRoom;
