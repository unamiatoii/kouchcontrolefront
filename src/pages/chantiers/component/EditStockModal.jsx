import React, { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { updateStock } from "services/Api/StockApi";

function EditStockModal({ selectedArticles, closeModal, refreshArticles }) {
  const [quantities, setQuantities] = useState(
    selectedArticles.reduce((acc, article) => {
      acc[article.article_id] = article.total_quantity;
      return acc;
    }, {})
  );
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (articleId, value) => {
    setQuantities({ ...quantities, [articleId]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateStock(
        selectedArticles.map((article) => ({
          article_id: article.article_id,
          quantity: quantities[article.article_id],
        }))
      );
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
    <div
      className="modal fade show"
      id="editStockModal"
      aria-labelledby="editStockModalLabel"
      aria-hidden="false"
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <div
        className="modal-dialog "
        style={{
          maxWidth: "50%",
          animation: "scaleIn 0.3s ease-in-out",
          padding: "10px",
        }}
      >
        <div className="modal-content" style={{ borderRadius: "15px" }}>
          <div className="modal-header">
            <h5 className="modal-title">Modifier le stock</h5>
          </div>
          <div className="modal-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Quantité actuelle</th>
                  <th>Nouvelle quantité</th>
                </tr>
              </thead>
              <tbody>
                {selectedArticles.map((article) => (
                  <tr key={article.article_id}>
                    <td>{article.article_name}</td>
                    <td>{article.total_quantity}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={quantities[article.article_id]}
                        onChange={(e) => handleQuantityChange(article.article_id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal}>
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Mise à jour..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

EditStockModal.propTypes = {
  selectedArticles: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired,
  refreshArticles: PropTypes.func.isRequired,
};

export default EditStockModal;
