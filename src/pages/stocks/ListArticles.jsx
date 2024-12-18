import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getArticles, deleteArticle } from "services/Api/ArticleApi";
import ArticleModal from "./component/ArticleModal";
import ConfirmationModal from "./component/ConfirmationModal"; // Import du modal de confirmation

function ListeArticles() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Modal de confirmation de suppression
  const [articleToDelete, setArticleToDelete] = useState(null); // Article à supprimer

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des articles.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (article) => {
    setLoading(true);
    try {
      await deleteArticle(article.id);
      toast.success("Article supprimé avec succès.");
      fetchArticles();
      setShowConfirmationModal(false); // Fermer le modal de confirmation après la suppression
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'article.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const results = articles.filter((article) =>
      article.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredArticles(results);
  };

  const handleAddArticle = () => {
    setSelectedArticle(null);
    setShowArticleModal(true);
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleCloseArticleModal = () => {
    setShowArticleModal(false);
    setSelectedArticle(null);
  };

  const handleOpenConfirmationModal = (article) => {
    setArticleToDelete(article); // Set the article to be deleted
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false); // Close the confirmation modal
    setArticleToDelete(null); // Reset the article to delete
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={1}
                px={1}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Liste des articles
                </MDTypography>
                <input
                  type="text"
                  className="form-control mb-3 p-2"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "350px" }}
                />
                <button className="btn btn-primary" onClick={handleAddArticle}>
                  Ajouter un Article
                </button>
              </MDBox>
              <MDBox pt={3}>
                <div className="text-center">
                  {loading ? (
                    <div className="text-center my-3">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                    </div>
                  ) : (
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Catégorie</th>
                          <th>Prix</th>
                          <th>Seuil</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredArticles.length > 0 ? (
                          filteredArticles.map((article) => (
                            <tr key={article.id}>
                              <td>{article.name}</td>
                              <td>{article.category?.name}</td>
                              <td>{article.price} FCFA</td>
                              <td>{article.reorder_threshold}</td>
                              <td>{article.description}</td>
                              <td>
                                <button
                                  className="btn btn-warning btn-sm me-2"
                                  onClick={() => handleEditArticle(article)}
                                >
                                  Modifier
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleOpenConfirmationModal(article)}
                                >
                                  Supprimer
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Aucun article trouvé.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Article Modal */}
      {showArticleModal && (
        <ArticleModal
          article={selectedArticle}
          refreshArticles={fetchArticles}
          closeModal={handleCloseArticleModal}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <ConfirmationModal
          article={articleToDelete}
          handleDelete={handleDelete}
          closeModal={handleCloseConfirmationModal}
        />
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default ListeArticles;
