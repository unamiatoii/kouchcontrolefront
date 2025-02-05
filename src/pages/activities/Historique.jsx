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
import { getActivitiesHistorique } from "services/Api/UserApi";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

function Historique() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await getActivitiesHistorique();

      if (response?.data?.data && Array.isArray(response.data.data)) {
        setActivities(response.data.data);
      } else {
        throw new Error("Format de données inattendu");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des activités :", error);
      toast.error("Impossible de charger les activités.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (query.trim() === "") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(
        activities.filter(
          (activity) =>
            activity.user?.name?.toLowerCase().includes(query) ||
            activity.action?.toLowerCase().includes(query)
        )
      );
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
                  Liste des activités des utilisateurs
                </MDTypography>
                <input
                  type="text"
                  className="form-control mb-3 p-2"
                  placeholder="Rechercher une activité..."
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
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Nom et prénoms</th>
                          <th>Action</th>
                          <th>IP Address</th>
                          <th>Appareil</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActivities.length > 0 ? (
                          filteredActivities.map((activity) => (
                            <tr key={activity.id}>
                              <td>{activity.user?.name || "Non défini"}</td>
                              <td>{activity.action}</td>
                              <td>{activity.ip_address}</td>
                              <td>{activity.user_agent}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              Aucune activité trouvée.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Historique;
