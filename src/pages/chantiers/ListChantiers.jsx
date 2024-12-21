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
import { getChantiers, deleteChantier } from "services/Api/ChantierApi";
import ChantierModal from "./component/ChantierModal";
import ConfirmationModal from "./component/ConfirmationModal";

function ListeChantiers() {
  const [chantiers, setChantiers] = useState([]);
  const [filteredChantiers, setFilteredChantiers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChantierModal, setShowChantierModal] = useState(false);
  const [selectedChantier, setSelectedChantier] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [chantierToDelete, setChantierToDelete] = useState(null);

  useEffect(() => {
    fetchChantiers();
  }, []);

  const fetchChantiers = async () => {
    setLoading(true);
    try {
      const data = await getChantiers();
      setChantiers(data);
      setFilteredChantiers(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des chantiers.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!chantierToDelete) return;

    setLoading(true);
    try {
      await deleteChantier(chantierToDelete.id);
      toast.success("Chantier supprimé avec succès.");
      fetchChantiers();
    } catch (error) {
      toast.error("Erreur lors de la suppression du chantier.");
    } finally {
      setShowConfirmationModal(false);
      setChantierToDelete(null);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() === "") {
      setFilteredChantiers(chantiers);
      return;
    }

    const results = chantiers.filter((chantier) =>
      chantier.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredChantiers(results);
  };

  const handleAddChantier = () => {
    setSelectedChantier(null);
    setShowChantierModal(true);
  };

  const handleEditChantier = (chantier) => {
    setSelectedChantier(chantier);
    setShowChantierModal(true);
  };

  const handleCloseChantierModal = () => {
    setShowChantierModal(false);
    setSelectedChantier(null);
  };

  const handleOpenConfirmationModal = (chantier) => {
    setChantierToDelete(chantier);
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setChantierToDelete(null);
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
                  Liste des chantiers
                </MDTypography>
                <input
                  type="text"
                  className="form-control mb-3 p-2"
                  placeholder="Rechercher un chantier..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "350px" }}
                />
                <button className="btn btn-primary" onClick={handleAddChantier}>
                  Ajouter un chantier
                </button>
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
                        <th>Nom</th>
                        <th>Localisation</th>
                        <th>Budget</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Chef chantier</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredChantiers.length > 0 ? (
                        filteredChantiers.map((chantier) => (
                          <tr key={chantier.id}>
                            <td>{chantier.name}</td>
                            <td>{chantier.location}</td>
                            <td>{chantier.budget} FCFA</td>
                            <td>{chantier.start_date}</td>
                            <td>{chantier.end_date || "N/A"}</td>
                            <td>{chantier.user?.name || "Non attribué"}</td>
                            <td>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEditChantier(chantier)}
                              >
                                Modifier
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleOpenConfirmationModal(chantier)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            Aucun chantier trouvé.
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

      {/* Chantier Modal */}
      {showChantierModal && (
        <ChantierModal
          chantier={selectedChantier}
          refreshChantiers={fetchChantiers}
          closeModal={handleCloseChantierModal}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <ConfirmationModal
          chantier={chantierToDelete}
          handleDelete={handleDelete}
          closeModal={handleCloseConfirmationModal}
        />
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default ListeChantiers;
