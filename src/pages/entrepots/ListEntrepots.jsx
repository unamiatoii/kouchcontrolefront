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
import { getEntrepots, deleteEntrepot } from "services/Api/EntrepotApi";
import EntrepotModal from "./component/EntrepotModal";
import ConfirmationModal from "./component/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../../utils/stringUtils";

function ListeEntrepots() {
  const [entrepots, setEntrepots] = useState([]);
  const [filteredEntrepot, setFilteredEntrepots] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEntrepotModal, setShowEntrepotModal] = useState(false);
  const [selectedEntrepot, setSelectedEntrepot] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [entrepotToDelete, setEntrepotToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEntrepots();
  }, []);

  const fetchEntrepots = async () => {
    setLoading(true);
    try {
      const data = await getEntrepots();
      setEntrepots(data);
      setFilteredEntrepots(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des entrepots.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entrepot) => {
    setLoading(true);
    try {
      await deleteEntrepot(entrepot.id);
      toast.success("Entrepot supprimé avec succès.");
      fetchEntrepots();
      setShowConfirmationModal(false); // Fermer le modal de confirmation après la suppression
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'entrepot.");
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    const results = entrepots.filter((entrepot) =>
      entrepot.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEntrepots(results);
  };

  const handleAddEntrepot = () => {
    setSelectedEntrepot(null);
    setShowEntrepotModal(true);
  };

  const handleEditEntrepot = (entrepot) => {
    setSelectedEntrepot(entrepot);
    setShowEntrepotModal(true);
  };

  const handleCloseEntrepotModal = () => {
    setShowEntrepotModal(false);
    setSelectedEntrepot(null);
  };

  const handleOpenConfirmationModal = (entrepot) => {
    setEntrepotToDelete(entrepot); // Set the entrepot to be deleted
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false); // Close the confirmation modal
    setEntrepotToDelete(null); // Reset the entrepot to delete
  };
  const handleShowStockEntrepot = (entrepotName) => {
    navigate(`/stock/entrepot/${entrepotName}`);
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
                  Liste des entrepots
                </MDTypography>
                <input
                  type="text"
                  className="form-control mb-3 p-2"
                  placeholder="Rechercher un entrepot..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "350px" }}
                />
                <button className="btn btn-primary" onClick={handleAddEntrepot}>
                  Ajouter un entrepot
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
                          <th>Adresse</th>
                          <th>Responsable</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntrepot.length > 0 ? (
                          filteredEntrepot.map((entrepot) => (
                            <tr key={entrepot.id}>
                              <td>{entrepot.name}</td>
                              <td>{entrepot.address}</td>
                              <td>{entrepot.responsable}</td>
                              <td>
                                <button
                                  className="btn btn-warning btn-sm me-2"
                                  onClick={() => handleEditEntrepot(entrepot)}
                                >
                                  Modifier
                                </button>
                                <button
                                  className="btn btn-danger btn-sm me-2"
                                  onClick={() => handleOpenConfirmationModal(entrepot)}
                                >
                                  Supprimer
                                </button>
                                <button
                                  className="btn btn-info btn-sm me-2"
                                  onClick={() => handleShowStockEntrepot(toSlug(entrepot.name))}
                                >
                                  Voir le stock
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Aucun entrepot trouvé.
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

      {/* Entrepot Modal */}
      {showEntrepotModal && (
        <EntrepotModal
          entrepot={selectedEntrepot}
          refreshEntrepots={fetchEntrepots}
          closeModal={handleCloseEntrepotModal}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <ConfirmationModal
          entrepot={entrepotToDelete}
          handleDelete={handleDelete}
          closeModal={handleCloseConfirmationModal}
        />
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default ListeEntrepots;
