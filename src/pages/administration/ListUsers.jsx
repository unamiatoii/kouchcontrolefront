import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
const Users = () => (
  <DashboardLayout>
    <DashboardNavbar />
    <MDBox py={3}>
      <div className="container mt-5">
        <h1>Users</h1>
        <p>Contenu spécifique à cette page.</p>
      </div>
    </MDBox>
    <Footer />
  </DashboardLayout>
);

export default Users;
