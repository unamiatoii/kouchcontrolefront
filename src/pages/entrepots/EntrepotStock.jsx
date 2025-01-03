import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStockEntrepot } from "services/Api/StockApi";
import { useParams } from "react-router-dom";
import ConfirmationModal from "./component/ConfirmationModal";
import Badge from "react-bootstrap/Badge";

function EntrepotStock() {
  const [stock, setStock] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    confirmationModal: false,
    selectedArticle: null,
  });
  const [selectedArticles, setSelectedArticles] = useState([]);
  const { entrepotId } = useParams();

  // Function to fetch stock data for the entrepot
  useEffect(() => {
    if (entrepotId) {
      setLoading(true);
      getStockEntrepot(entrepotId)
        .then((data) => {
          if (data.length === 0) {
            toast.warn("Aucun stock trouvé pour ce entrepot.");
          }
          setStock(data);
          setFilteredArticles(data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des stocks du entrepot :", error);
          toast.error("Erreur lors de la récupération des stocks.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("ID du entrepot manquant.");
      toast.error("L'ID du entrepot est manquant.");
    }
  }, [entrepotId]);

  // Search filter function
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredArticles(
      stock.filter((article) => article.article_name?.toLowerCase().includes(value))
    );
  };

  // Toggle selection of articles
  const toggleSelection = (articleId) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  // Select or deselect all articles
  const handleSelectAll = () => {
    setSelectedArticles(
      selectedArticles.length === filteredArticles.length
        ? []
        : filteredArticles.map((article) => article.article_id)
    );
  };

  // Open confirmation modal
  const openConfirmationModal = (article) => {
    setModalState({ confirmationModal: true, selectedArticle: article });
  };

  // Close modal
  const closeModal = () => {
    setModalState({ confirmationModal: false, selectedArticle: null });
  };

  // Handle delete of an article
  const handleDelete = async () => {
    const { selectedArticle } = modalState;
    if (!selectedArticle) return;

    setLoading(true);
    try {
      toast.success("Article supprimé avec succès.");
      setStock((prevStock) =>
        prevStock.filter((article) => article.article_id !== selectedArticle.article_id)
      );
      setFilteredArticles((prevFilteredArticles) =>
        prevFilteredArticles.filter((article) => article.article_id !== selectedArticle.article_id)
      );
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
                  Liste des articles en stock
                </MDTypography>
                <input
                  type="text"
                  className="form-control mb-3 p-2 mx-2"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "350px" }}
                />
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
                        <th>Code</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix Unitaire</th>
                        <th>Prix Total</th>
                        <th>Quantité Total</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                          <tr key={article.article_id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedArticles.includes(article.article_id)}
                                onChange={() => toggleSelection(article.article_id)}
                              />
                            </td>
                            <td className="fw-bold">#{article.article_code}</td>
                            <td>{article.article_name}</td>
                            <td>{article.category_name || "Non défini"}</td>
                            <td>{article.article_price}</td>
                            <td>
                              <Badge pill bg="primary">
                                {article.total_price} FCFA
                              </Badge>
                            </td>
                            <td>
                              <Badge pill bg="info">
                                {article.total_quantity}
                              </Badge>
                            </td>
                            <td>{article.article_description || "Aucune description"}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => openConfirmationModal(article)}
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
      {modalState.confirmationModal && (
        <ConfirmationModal
          article={modalState.selectedArticle}
          handleDelete={handleDelete}
          closeModal={closeModal}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}

EntrepotStock.propTypes = {
  entrepotId: PropTypes.number.isRequired,
};

export default EntrepotStock;
