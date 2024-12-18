import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createArticle, updateArticle } from "services/Api/ArticleApi";
import { getCategories } from "services/Api/CategorieApi";

const ArticleModal = ({ article, refreshArticles, closeModal }) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [reorderThreshold, setReorderThreshold] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

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
      } else {
        await createArticle(articleData);
      }

      refreshArticles();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'article :", error);
    }
  };

  return (
    <div
      className="modal fade show"
      id="articleModal"
      tabIndex="-1"
      aria-labelledby="articleModalLabel"
      aria-hidden={!article}
      style={{ display: "block", opacity: 1 }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="articleModalLabel">
                {article ? "Modifier l'Article" : "Ajouter un Article"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
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
              <button type="submit" className="btn btn-primary">
                {article ? "Mettre à jour" : "Ajouter"}
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
