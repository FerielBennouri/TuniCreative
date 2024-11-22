import React from "react";
import Modal from "react-modal";
import "./ErrorModal.scss";

const ErrorModal = ({ isOpen, onRequestClose, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="error-modal"
      overlayClassName="error-overlay"
    >
      <h2>Error</h2>
      <p>{message}</p>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ErrorModal;
