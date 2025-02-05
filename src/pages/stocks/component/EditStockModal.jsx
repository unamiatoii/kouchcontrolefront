import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { updateStock } from "services/Api/StockApi";

function EditStockModal({ article, closeModal, refreshArticles }) {
  const [quantity, setQuantity] = useState(article.total_quantity);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSubmit = async () => {
    if (quantity < 0 || isNaN(quantity)) {
      toast.error("Veuillez entrer une quantité valide.");
      return;
    }

    setLoading(true);
    try {
      await updateStock(article.article_id, { quantity });
      toast.success("Stock mis à jour avec succès.");
      refreshArticles();
      closeModal();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier le Stock de </h5>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Quantité</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={handleQuantityChange}
                min="0"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Mise à jour..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

EditStockModal.propTypes = {
  article: PropTypes.shape({
    article_id: PropTypes.number.isRequired,
    total_quantity: PropTypes.number.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  refreshArticles: PropTypes.func.isRequired,
};

export default EditStockModal;
