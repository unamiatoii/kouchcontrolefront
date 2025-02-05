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
import { getMouvements } from "services/Api/MouvementApi";
import Pagination from "react-bootstrap/Pagination";
import { useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

function TransfertArticleListe() {
  const [mouvements, setMouvements] = useState([]);
  const [filteredMouvements, setFilteredMouvements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchMouvements(currentPage);
  }, [currentPage]);

  const fetchMouvements = async (page) => {
    setLoading(true);
    try {
      const response = await getMouvements(page);
      const { data, last_page } = response.data;
      setMouvements(data);
      setFilteredMouvements(data);
      setTotalPages(last_page);
    } catch (error) {
      toast.error("Erreur lors de la récupération des mouvements.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const results = mouvements.filter((mouvement) =>
      mouvement.article?.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredMouvements(results);
  };

  const formatMontant = (montant) => montant.toLocaleString("fr-FR") + " FCFA";

  const getRowColor = (type) => {
    switch (type) {
      case "entrée":
        return "rgba(0, 255, 0, 0.2)";
      case "sortie":
        return "rgba(255, 0, 0, 0.2)";
      case "transfert":
        return "rgba(0, 0, 255, 0.2)";
      default:
        return "transparent";
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
                  Liste des Mouvements
                </MDTypography>
                <input
                  type="text"
                  className="form-control mb-3 p-2"
                  placeholder="Rechercher un mouvement..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "350px" }}
                />
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
                    <>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Article</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Agent</th>
                            <th>Type</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMouvements.length > 0 ? (
                            filteredMouvements.map((mouvement) => (
                              <tr
                                key={mouvement.id}
                                style={{
                                  backgroundColor: getRowColor(mouvement.type),
                                }}
                              >
                                <td className="fw-bold">#{mouvement.article?.code || " "}</td>
                                <td>{mouvement.article?.name || "N/A"}</td>
                                <td>
                                  {mouvement.user?.chantier ||
                                    mouvement.user?.entrepot ||
                                    "Administration"}
                                </td>
                                <td>
                                  {mouvement.chantier?.name ||
                                    mouvement.entrepot?.name ||
                                    "Non spécifié"}
                                </td>
                                <td>{formatMontant(mouvement.article?.price)}</td>
                                <td>{mouvement.quantity}</td>
                                <td>{mouvement.user?.name || "Anonyme"}</td>
                                <td>{mouvement.type}</td>
                                <td>{moment(mouvement.created_at).fromNow()}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                Aucun mouvement trouvé.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="d-flex justify-content-center">
                        <Pagination>
                          <Pagination.First
                            onClick={() => handlePageChange(currentPage - 2)}
                            disabled={currentPage === 1}
                          />
                          <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          />
                          {[...Array(totalPages).keys()].map((i) => (
                            <Pagination.Item
                              key={i + 1}
                              onClick={() => handlePageChange(i + 1)}
                              active={i + 1 === currentPage}
                            >
                              {i + 1}
                            </Pagination.Item>
                          ))}
                          <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          />
                          <Pagination.Last
                            onClick={() => handlePageChange(currentPage + 2)}
                            disabled={currentPage === totalPages}
                          />
                        </Pagination>
                      </div>
                    </>
                  )}
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TransfertArticleListe;
