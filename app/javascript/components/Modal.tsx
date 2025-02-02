import React from 'react';

const Modal = ({ isOpen, closeModal, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-stone-700 bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                className="bg-neutral-900 rounded-lg p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
