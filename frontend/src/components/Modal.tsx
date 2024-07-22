import React from 'react';
import "../styles/modal.css";

// Define props type inline
const Modal = ({ show, onClose, children, className, contentClassName }: { show: boolean; onClose: () => void; children: React.ReactNode, className?:string, contentClassName?:string }) => {
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
        <div className={`modal-overlay ${className}`} onClick={handleOverlayClick}>
            <div className={`modal-content ${contentClassName || ''}`}>
                <button className="modal-close" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
