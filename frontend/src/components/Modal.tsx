import React from 'react';
import "../styles/modal.css";

// Define props type inline
const Modal = ({ show, onClose, children }: { show: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!show) {
        return null;
    }

    // Function to handle clicks on the overlay
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // Check if the click was outside the modal content
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
