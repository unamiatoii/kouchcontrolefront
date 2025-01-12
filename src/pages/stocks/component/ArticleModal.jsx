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
  const [unit, setUnit] = useState(""); // État pour l'unité
  const [reorderThreshold, setReorderThreshold] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const units = [
    { value: "m", label: "m (Mètre)" },
    { value: "m²", label: "m² (Mètre carré)" },
    { value: "m³", label: "m³ (Mètre cube)" },
    { value: "kg", label: "kg (Kilogramme)" },
    { value: "t", label: "t (Tonne)" },
    { value: "L", label: "L (Litre)" },
    { value: "U", label: "U (Unité)" },
    { value: "Pce", label: "Pce (Pièce)" },
    { value: "Paquet", label: "Paquet" },
    { value: "Sac", label: "Sac" },
    { value: "Bobine", label: "Bobine" },
    { value: "Barre", label: "Barre" },
    { value: "Tonneau", label: "Tonneau" },
    { value: "Rouleau", label: "Rouleau" },
    { value: "Km", label: "Km (Kilomètre)" },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (article) {
      setName(article.name || "");
      setCategoryId(article.category_id || "");
      setPrice(article.price || "");
      setUnit(article.unit || ""); // Initialiser l'unité si elle existe
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
    setUnit(""); // Réinitialiser l'unité
    setReorderThreshold("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const articleData = {
        name,
        category_id: categoryId,
        price,
        unit, // Inclure l'unité
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
      setIsLoading(false);
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: "50%",
          animation: "scaleIn 0.3s ease-in-out",
        }}
      >
        <div className="modal-content" style={{ borderRadius: "15px" }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom de l&apos;article</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ciment"
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
                  placeholder="Ex: 25000"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantité global</label>
                <input
                  type="number"
                  className="form-control"
                  value={reorderThreshold}
                  onChange={(e) => setReorderThreshold(e.target.value)}
                  placeholder="Ex: 48"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Unité</label>
                <select
                  className="form-control form-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez une unité</option>
                  {units.map((unitOption) => (
                    <option key={unitOption.value} value={unitOption.value}>
                      {unitOption.label}
                    </option>
                  ))}
                </select>
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
