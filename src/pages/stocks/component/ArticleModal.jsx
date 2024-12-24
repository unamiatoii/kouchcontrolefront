import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createArticle, updateArticle } from "services/Api/ArticleApi";
import { getCategories } from "services/Api/CategorieApi";

const ArticleModal = ({ article, refreshArticles, closeModal }) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [reorderThreshold, setReorderThreshold] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // État pour gérer le chargement

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (article) {
      setName(article.name || "");
      setCategoryId(article.category_id || "");
      setPrice(article.price || "");
      setReorderThreshold(article.reorder_threshold || "");
      setDescription(article.description || "");
    } else {
      resetForm();
    }
  }, [article]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setPrice("");
    setReorderThreshold("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activer le chargement
    try {
      const articleData = {
        name,
        category_id: categoryId,
        price,
        reorder_threshold: reorderThreshold,
        description,
      };

      if (article) {
        await updateArticle(article.id, articleData);
        toast.success("Article modifié avec succès.");
      } else {
        await createArticle(articleData);
        toast.success("Article enregistré avec succès.");
      }

      refreshArticles();
      closeModal();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de l'article.");
      console.error("Erreur lors de l'enregistrement de l'article :", error);
    } finally {
      setIsLoading(false); // Désactiver le chargement
    }
  };

  return (
    <div
      className="modal fade show"
      id="articleModal"
      aria-labelledby="articleModalLabel"
      aria-hidden="false"
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
        animation: "fadeIn 0.3s ease-in-out", // Animation d'apparition
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: "50%", // Largeur personnalisée
          animation: "scaleIn 0.3s ease-in-out", // Animation de mise à l'échelle
        }}
      >
        <div className="modal-content" style={{ borderRadius: "15px" }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom de l article</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Catégorie</label>
                <select
                  className="form-control form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Prix</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Seuil de Réapprovisionnement</label>
                <input
                  type="number"
                  className="form-control"
                  value={reorderThreshold}
                  onChange={(e) => setReorderThreshold(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Chargement...
                  </>
                ) : article ? (
                  "Mettre à jour"
                ) : (
                  "Ajouter"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ArticleModal.propTypes = {
  article: PropTypes.object,
  refreshArticles: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ArticleModal;
