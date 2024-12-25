import React from "react";
import PropTypes from "prop-types";

const ConfirmationModal = ({ chantier, handleDelete, closeModal }) => {
  return (
    <div
      className="modal fade show"
      id="confirmationModal"
      tabIndex="-1"
      aria-labelledby="confirmationModalLabel"
      aria-hidden={!chantier}
      style={{ display: "block", opacity: 1 }}
    >
      <div className="modal-dialog" style={{ maxWidth: "40%" }}>
        <div className="modal-content">
          <div className="modal-body">
            Êtes-vous sûr de vouloir supprimer cet chantier <strong>{chantier?.name}</strong> ?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Annuler
            </button>
            <button type="button" className="btn btn-danger" onClick={() => handleDelete(chantier)}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  chantier: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ConfirmationModal;
