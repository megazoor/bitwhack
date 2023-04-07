import React from "react";
import "./Modal.css";

const Modal = ({ show, title, message, buttonText, onClick, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClick}>{buttonText}</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
