import React from 'react';
import "../styles/modal.css";

// Define props type inline
const Modal = ({ show, onClose, children }: { show: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
