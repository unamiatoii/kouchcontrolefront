import React from "react";
import PropTypes from "prop-types";

const ConfirmationModal = ({ article, handleDelete, closeModal }) => {
  return (
    <div
      className="modal fade show"
      id="confirmationModal"
      tabIndex="-1"
      aria-labelledby="confirmationModalLabel"
      aria-hidden={!article}
      style={{ display: "block", opacity: 1 }}
    >
      <div className="modal-dialog" style={{ maxWidth: "40%" }}>
        <div className="modal-content">
          <div className="modal-body">
            Êtes-vous sûr de vouloir supprimer cet article <strong>{article?.name}</strong> ?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Annuler
            </button>
            <button type="button" className="btn btn-danger" onClick={() => handleDelete(article)}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  article: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ConfirmationModal;
