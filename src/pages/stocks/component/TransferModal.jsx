import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { getEntrepots } from "services/Api/EntrepotApi";
import { getChantiers } from "services/Api/ChantierApi";
import { transfertArticleToEntrepotOrChantier } from "services/Api/ArticleApi";

function TransferModal({ selectedArticles, transferType, closeModal, refreshArticles }) {
  const [quantities, setQuantities] = useState(
    selectedArticles.reduce((acc, article) => {
      acc[article.id] = ""; // Initialisation des quantités
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({}); // Gestion des erreurs
  const [destinations, setDestinations] = useState([]); // Liste des destinations
  const [selectedDestination, setSelectedDestination] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger les entrepôts ou chantiers
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = transferType === "entrepot" ? await getEntrepots() : await getChantiers();
        setDestinations(data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des destinations.");
      }
    };
    fetchDestinations();
  }, [transferType]);

  const handleQuantityChange = (articleId, value) => {
    const quantity = Number(value);
    const article = selectedArticles.find((a) => a.id === articleId);
    const availableQuantity = article.reorder_threshold;

    // Validation locale
    let errorMessage = "";
    if (quantity > availableQuantity) {
      errorMessage = `Quantité saisie dépasse le stock disponible (${availableQuantity}).`;
    } else if (quantity < 1 || isNaN(quantity)) {
      errorMessage = "Quantité invalide.";
    }

    setErrors((prev) => ({
      ...prev,
      [articleId]: errorMessage,
    }));

    setQuantities((prev) => ({
      ...prev,
      [articleId]: quantity,
    }));
  };

  const handleSubmit = async () => {
    // Validation des données
    const hasErrors = Object.values(errors).some((error) => error);
    const validQuantities = selectedArticles.every((article) => {
      const quantity = Number(quantities[article.id]);
      return quantity > 0 && quantity <= article.reorder_threshold;
    });

    if (hasErrors || !validQuantities) {
      toast.error(
        "Veuillez corriger les erreurs ou entrer des quantités valides pour tous les articles."
      );
      return;
    }

    if (!selectedDestination) {
      toast.error("Veuillez sélectionner une destination.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        articles: selectedArticles.map((article) => ({
          article_id: article.id,
          quantity: Number(quantities[article.id]),
        })),
        chantier_id: transferType === "chantier" ? Number(selectedDestination) : null,
        entrepot_id: transferType === "entrepot" ? Number(selectedDestination) : null,
      };

      await transfertArticleToEntrepotOrChantier(payload);

      toast.success("Transfert effectué avec succès.");
      refreshArticles();
      closeModal();
    } catch (error) {
      toast.error("Erreur lors du transfert des articles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: "50%",
          animation: "scaleIn 0.3s ease-in-out",
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {transferType === "entrepot"
                ? "Transfert vers un Entrepôt"
                : "Transfert vers un Chantier"}
            </h5>
          </div>
          <div className="modal-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Article</th>
                  <th>Quantité Disponible</th>
                  <th>Quantité</th>
                </tr>
              </thead>
              <tbody>
                {selectedArticles.map((article) => (
                  <tr key={article.id}>
                    <td>{article.code}</td>
                    <td>{article.name}</td>
                    <td>{article.reorder_threshold}</td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${errors[article.id] ? "is-invalid" : ""}`}
                        value={quantities[article.id]}
                        onChange={(e) => handleQuantityChange(article.id, e.target.value)}
                        min="1"
                      />
                      {errors[article.id] && (
                        <div className="invalid-feedback">{errors[article.id]}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mb-3">
              <label className="form-label">
                {transferType === "entrepot"
                  ? "Sélectionnez un Entrepôt"
                  : "Sélectionnez un Chantier"}
              </label>
              <select
                className="form-control form-select"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                required
              >
                <option value="">-- Sélectionnez une destination --</option>
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
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
              {loading ? "Transfert en cours..." : "Confirmer le Transfert"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

TransferModal.propTypes = {
  selectedArticles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      reorder_threshold: PropTypes.number.isRequired, // Ajout de la quantité disponible
    })
  ).isRequired,
  transferType: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  refreshArticles: PropTypes.func.isRequired,
};

export default TransferModal;
