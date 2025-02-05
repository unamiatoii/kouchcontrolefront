import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { getEntrepots } from "services/Api/EntrepotApi";
import { getChantiers } from "services/Api/ChantierApi";
import { transferArticlesEntrepotToChantierOrChantierToEntrepot } from "services/Api/ArticleApi";
import { useSelector } from "react-redux";

function TransferModal({ selectedArticles, transferType, closeModal, refreshArticles }) {
  const [quantities, setQuantities] = useState(() =>
    selectedArticles.reduce((acc, article) => {
      acc[article.article_id] = "";
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const chantierName = useSelector((state) => state.chantier.chantierName || "chantier-inconnu");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = transferType === "entrepot" ? await getEntrepots() : await getChantiers();
        // Filtrer la destination active
        const filteredDestinations = data.filter(
          (destination) => destination.name !== chantierName
        );
        setDestinations(filteredDestinations);
      } catch (error) {
        toast.error("Erreur lors de la récupération des destinations.");
      }
    };
    fetchDestinations();
  }, [transferType, chantierName]);

  const handleQuantityChange = (articleId, value) => {
    const quantity = Number(value);
    const article = selectedArticles.find((a) => a.article_id === articleId);

    if (!article) return;

    const availableQuantity = article.total_quantity || 0;
    let errorMessage = "";

    if (quantity > availableQuantity) {
      errorMessage = `Quantité maximale (${availableQuantity}) dépassée.`;
    } else if (quantity < 1 || isNaN(quantity)) {
      errorMessage = "Quantité invalide.";
    }

    setErrors((prev) => ({
      ...prev,
      [articleId]: errorMessage,
    }));

    setQuantities((prev) => ({
      ...prev,
      [articleId]: value,
    }));
  };

  const handleSubmit = async () => {
    const hasErrors = Object.values(errors).some((error) => error);
    const validQuantities = selectedArticles.every((article) => {
      const quantity = Number(quantities[article.article_id]);
      return quantity > 0 && quantity <= (article.total_quantity || 0);
    });

    if (hasErrors || !validQuantities) {
      toast.error("Corrigez les erreurs ou entrez des quantités valides.");
      return;
    }

    if (!selectedDestination) {
      toast.error("Sélectionnez une destination.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        articles: selectedArticles.map((article) => ({
          article_id: article.article_id,
          quantity: Number(quantities[article.article_id]),
        })),
        chantier_id: transferType === "chantier" ? Number(selectedDestination) : null,
        entrepot_id: transferType === "entrepot" ? Number(selectedDestination) : null,
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
    <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "50%" }}>
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
                  <tr key={article.article_id}>
                    <td>{article.article_code || article.article_id}</td>
                    <td>{article.article_name || "Article sans nom"}</td>
                    <td>{article.total_quantity || 0}</td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${errors[article.article_id] ? "is-invalid" : ""}`}
                        value={quantities[article.article_id]}
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
      article_id: PropTypes.number.isRequired,
      article_code: PropTypes.string,
      article_name: PropTypes.string,
      total_quantity: PropTypes.number,
    })
  ).isRequired,
  transferType: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  chantierName: PropTypes.string,
  refreshArticles: PropTypes.func.isRequired,
};

export default TransferModal;
