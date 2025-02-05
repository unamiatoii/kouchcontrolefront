import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Grid, Card, CircularProgress, TextField, Checkbox } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStockChantier } from "services/Api/StockApi";
import Badge from "react-bootstrap/Badge";
import EditStockModal from "../stocks/component/EditStockModal";
import CommandeModal from "../chantiers/component/CommandeModal";
import ConfirmationModal from "./component/ConfirmationModal";
import TransferModal from "../stocks/component/TransferModal";
import { useSelector } from "react-redux";
import { toSlug } from "../../utils/stringUtils";

function StockChantier() {
  const [stock, setStock] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState([]);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    article: null,
    transferType: null,
  });

  const user = useSelector((state) => state.auth.user);
  const chantierName = toSlug(user?.chantier || "");

  // Fetch stock data
  const fetchStock = useCallback(async () => {
    if (!chantierName) {
      toast.error("Le nom du chantier est manquant.");
      return;
    }

    setLoading(true);
    try {
      const data = await getStockChantier(chantierName);
      //console.log(data);
      setStock(data);
      setFilteredArticles(data);
      if (data.length === 0) {
        toast.warn("Aucun stock trouvé pour ce chantier.");
      }
    } catch (error) {
      toast.error("Erreur lors de la récupération des stocks.");
    } finally {
      setLoading(false);
    }
  }, [chantierName]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredArticles(
      stock.filter((article) => article.article_name?.toLowerCase().includes(value))
    );
  };

  const toggleSelection = (articleId) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedArticles(
      selectedArticles.length === filteredArticles.length
        ? []
        : filteredArticles.map((article) => article.article_id)
    );
  };

  const openModal = (type, article = null, transferType = null) => {
    setModalState({ type, isOpen: true, article, transferType });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, article: null, transferType: null });
  };

  const handleDelete = async () => {
    if (!modalState.article) return;

    setLoading(true);
    try {
      await deleteArticle(modalState.article.id); // Assumes deleteArticle is imported
      toast.success("Article supprimé avec succès.");
      fetchStock();
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
                display="flex"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Liste des articles en stock
                </MDTypography>
                <TextField
                  variant="outlined"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={handleSearch}
                  size="small"
                  style={{ width: "350px" }}
                />
                <div>
                  <button
                    className="btn btn-primary me-2 mb-1"
                    onClick={() => openModal("CommandeModal")}
                  >
                    Commander un article
                  </button>
                  {selectedArticles.length > 0 && (
                    <>
                      <button
                        className="btn btn-primary me-2 mb-1"
                        onClick={() => openModal("TransferModal", null, "entrepot")}
                      >
                        Transfert vers un Entrepôt
                      </button>
                      <button
                        className="btn btn-primary mb-1"
                        onClick={() => openModal("TransferModal", null, "chantier")}
                      >
                        Transfert vers un autre Chantier
                      </button>
                    </>
                  )}
                </div>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <div className="text-center my-3">
                    <CircularProgress />
                  </div>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>
                          <Checkbox
                            checked={selectedArticles.length === filteredArticles.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th>Code</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix Unitaire</th>
                        <th>Prix Total</th>
                        <th>Quantité Totale</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                          <tr key={article.article_id}>
                            <td>
                              <Checkbox
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
                                className="btn btn-warning btn-sm"
                                onClick={() => openModal("EditStockModal", article)}
                              >
                                Modifier le stock
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
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
      {modalState.isOpen && modalState.type === "EditStockModal" && (
        <EditStockModal
          article={modalState.article}
          closeModal={closeModal}
          refreshArticles={fetchStock}
        />
      )}
      {modalState.isOpen && modalState.type === "CommandeModal" && (
        <CommandeModal closeModal={closeModal} refreshArticles={fetchStock} />
      )}
      {modalState.isOpen && modalState.type === "TransferModal" && (
        <TransferModal
          transferType={modalState.transferType}
          selectedArticles={selectedArticles.map((id) =>
            stock.find((article) => article.article_id === id)
          )}
          closeModal={closeModal}
          refreshArticles={fetchStock}
        />
      )}
      {modalState.isOpen && modalState.type === "ConfirmationModal" && (
        <ConfirmationModal
          article={modalState.article}
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </DashboardLayout>
  );
}

StockChantier.propTypes = {
  chantierName: PropTypes.string,
};

export default StockChantier;
