import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { getEntrepots } from "services/Api/EntrepotApi";
import { getChantiers } from "services/Api/ChantierApi";
import { transferArticlesEntrepotToChantierOrChantierToEntrepot } from "services/Api/ArticleApi";

function TransferModal({ selectedArticles, sourceType, sourceId, closeModal, refreshArticles }) {
  const [quantities, setQuantities] = useState(
    selectedArticles.reduce((acc, article) => {
      acc[article.article_id] = "";
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [destinationType, setDestinationType] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const entrepots = await getEntrepots();
        const chantiers = await getChantiers();
        setDestinations([...entrepots, ...chantiers]);
      } catch (error) {
        toast.error("Erreur lors de la récupération des destinations.");
      }
    };
    fetchDestinations();
  }, []);

  const handleQuantityChange = (articleId, value) => {
    const quantity = Number(value);
    const article = selectedArticles.find((a) => a.article_id === articleId);
    const availableQuantity = article.total_quantity;

    let errorMessage = "";
    if (isNaN(quantity) || quantity < 1) {
      errorMessage = "Quantité invalide.";
    } else if (quantity > availableQuantity) {
      errorMessage = `Quantité saisie dépasse le stock disponible (${availableQuantity}).`;
    }

    setErrors((prev) => ({
      ...prev,
      [articleId]: errorMessage,
    }));

    setQuantities((prev) => ({
      ...prev,
      [articleId]: errorMessage ? "" : quantity,
    }));
  };

  const handleSubmit = async () => {
    if (!destinationType || !destinationId) {
      toast.error("Veuillez sélectionner une destination.");
      return;
    }

    const hasErrors = Object.values(errors).some((error) => error);
    const validQuantities = selectedArticles.every((article) => {
      const quantity = Number(quantities[article.article_id]);
      return quantity > 0 && quantity <= article.total_quantity;
    });

    if (hasErrors || !validQuantities) {
      toast.error("Veuillez corriger les erreurs de quantité.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        source_type: transferType, // "entrepot" ou "chantier"
        source_id:
          selectedArticles[0]?.[transferType === "entrepot" ? "entrepot_id" : "chantier_id"], // ID de la source
        destination_type: transferType === "entrepot" ? "chantier" : "entrepot", // Destination opposée
        destination_id: Number(selectedDestination), // ID de la destination sélectionnée
        articles: selectedArticles.map((article) => ({
          article_id: article.article_id,
          quantity: Number(quantities[article.article_id]),
        })),
      };

      await transferArticlesEntrepotToChantierOrChantierToEntrepot(payload);
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
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "50%" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Transfert d&apos;articles</h5>
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
                  <tr key={article.article_id}>
                    <td>{article.article_code}</td>
                    <td>{article.article_name}</td>
                    <td>{article.total_quantity}</td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${errors[article.article_id] ? "is-invalid" : ""}`}
                        value={quantities[article.article_id] || ""}
                        onChange={(e) => handleQuantityChange(article.article_id, e.target.value)}
                        min="1"
                      />
                      {errors[article.article_id] && (
                        <div className="invalid-feedback">{errors[article.article_id]}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mb-3">
              <label className="form-label">Sélectionnez une destination</label>
              <select
                className="form-control form-select"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
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
      article_id: PropTypes.number.isRequired,
      article_code: PropTypes.string.isRequired,
      article_name: PropTypes.string.isRequired,
      total_quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  sourceType: PropTypes.string.isRequired,
  sourceId: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
  refreshArticles: PropTypes.func.isRequired,
};

export default TransferModal;
