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
import ConfirmationModal from "./component/ConfirmationModal";
import TransferModal from "./component/TransferModal";
import Badge from "react-bootstrap/Badge";

function ListeArticles() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    articleModal: false,
    confirmationModal: false,
    transferModal: false,
    selectedArticle: null,
    transferType: null,
  });
  const [selectedArticles, setSelectedArticles] = useState([]);

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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const results = articles.filter((article) =>
      article.name?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredArticles(results);
  };

  const toggleSelection = (articleId) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map((article) => article.id));
    }
  };

  const openModal = (type, article = null, transferType = null) => {
    setModalState({
      articleModal: type === "article",
      confirmationModal: type === "confirmation",
      transferModal: type === "transfer",
      selectedArticle: article,
      transferType,
    });
  };

  const closeModal = () => {
    setModalState({
      articleModal: false,
      confirmationModal: false,
      transferModal: false,
      selectedArticle: null,
      transferType: null,
    });
  };

  const handleDelete = async () => {
    if (!modalState.selectedArticle) return;
    setLoading(true);
    try {
      await deleteArticle(modalState.selectedArticle.id);
      toast.success("Article supprimé avec succès.");
      fetchArticles();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'article.");
    } finally {
      setLoading(false);
      closeModal();
    }
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
                  className="form-control mb-3 p-2 mx-2"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "350px" }}
                />
                <div>
                  <button
                    className="btn btn-primary me-2 mb-1"
                    onClick={() => openModal("article")}
                  >
                    Ajouter un article
                  </button>
                  <button
                    className="btn btn-primary me-2 mb-1"
                    onClick={() => openModal("transfer", null, "entrepot")}
                  >
                    Transfert vers un Entrepôt
                  </button>
                  <button
                    className="btn btn-secondary mb-1"
                    onClick={() => openModal("transfer", null, "chantier")}
                  >
                    Transfert vers un Chantier
                  </button>
                </div>
              </MDBox>
              <MDBox pt={3}>
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
                        <th>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedArticles.length === filteredArticles.length}
                          />
                        </th>
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
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedArticles.includes(article.id)}
                                onChange={() => toggleSelection(article.id)}
                              />
                            </td>
                            <td>{article.name}</td>
                            <td>{article.category?.name}</td>
                            <td>{article.price} FCFA</td>
                            <td>
                              <Badge pill bg="info">
                                {article.reorder_threshold}
                              </Badge>
                            </td>
                            <td>{article.description}</td>
                            <td>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => openModal("article", article)}
                              >
                                Modifier
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => openModal("confirmation", article)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            Aucun article trouvé.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {modalState.articleModal && (
        <ArticleModal
          article={modalState.selectedArticle}
          refreshArticles={fetchArticles}
          closeModal={closeModal}
        />
      )}

      {modalState.confirmationModal && (
        <ConfirmationModal
          article={modalState.selectedArticle}
          handleDelete={handleDelete}
          closeModal={closeModal}
        />
      )}

      {modalState.transferModal && (
        <TransferModal
          selectedArticles={selectedArticles.map((id) =>
            articles.find((article) => article.id === id)
          )}
          transferType={modalState.transferType}
          closeModal={closeModal}
          refreshArticles={fetchArticles}
        />
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default ListeArticles;
