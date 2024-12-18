import React, { useState, useEffect } from "react";
import { getArticles, deleteArticle } from "services/Api/ArticleApi";
import ArticleModal from "./component/ArticleModal";

const ArticleTable = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await deleteArticle(id);
        fetchArticles();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article :", error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const results = articles.filter((article) =>
      article.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredArticles(results);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Liste des Articles</h3>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#articleModal"
          onClick={() => setSelectedArticle(null)}
        >
          Ajouter un Article
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Rechercher un article..."
        value={search}
        onChange={handleSearch}
      />

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.map((article) => (
            <tr key={article.id}>
              <td>{article.name}</td>
              <td>{article.description}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#articleModal"
                  onClick={() => setSelectedArticle(article)}
                >
                  Modifier
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(article.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ArticleModal article={selectedArticle} refreshArticles={fetchArticles} />
    </div>
  );
};

export default ArticleTable;
