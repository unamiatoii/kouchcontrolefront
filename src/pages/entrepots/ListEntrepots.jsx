import React, { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import AddCircle from "@mui/icons-material/AddCircle";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "./component/entrepotTable";

// CreateEntrepotModal import
import CreateEntrepotModal from "./component/createEntrepotModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntrepots } from "domain/entrepotSlice";

function ListeEntrepots() {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const { entrepots, loading, error } = useSelector((state) => state.entrepots);

  useEffect(() => {
    dispatch(fetchEntrepots());
  }, [dispatch]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Liste des entrepôts
                </MDTypography>
                <IconButton color="primary" onClick={handleOpenModal}>
                  <AddCircle color="secondary" />
                </IconButton>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <MDTypography variant="h6">Chargement...</MDTypography>
                ) : error ? (
                  <MDTypography variant="h6" color="error">
                    Erreur: {error}
                  </MDTypography>
                ) : (
                  <DataTable data={entrepots} />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Create Entrepot Modal */}
      <CreateEntrepotModal open={openModal} onClose={handleCloseModal} />
    </DashboardLayout>
  );
}

export default ListeEntrepots;
