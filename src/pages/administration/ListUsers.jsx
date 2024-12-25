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
import { getUsers, deleteUser } from "services/Api/UserApi";
import UserModal from "./component/UserModal";
import ConfirmationModal from "./component/ConfirmationModal";

function ListeUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response && Array.isArray(response.data)) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else {
        throw new Error("Format de données inattendu");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      toast.error("Impossible de charger les utilisateurs.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      await deleteUser(userToDelete.id);
      toast.success("Utilisateur supprimé avec succès.");
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      toast.error("Erreur lors de la suppression d'utilisateur.");
    } finally {
      setShowConfirmationModal(false);
      setUserToDelete(null);
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(query)));
  };

  // Modal handlers
  const openUserModal = (user = null) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const openConfirmationModal = (user) => {
    setUserToDelete(user);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setUserToDelete(null);
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
                  Liste des utilisateurs
                </MDTypography>
                <input
                  type="text"
                  className="form-control mb-3 p-2"
                  placeholder="Rechercher un utilisateur..."
                  value={search}
                  onChange={handleSearch}
                  style={{ width: "350px" }}
                />
                <button className="btn btn-primary" onClick={() => openUserModal()}>
                  Ajouter un utilisateur
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
                        <th>Nom et prénoms</th>
                        <th>E-mail</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role?.name || "Non défini"}</td>
                            <td>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => openUserModal(user)}
                              >
                                Modifier
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => openConfirmationModal(user)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            Aucun utilisateur trouvé.
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
      {showUserModal && (
        <UserModal user={selectedUser} refreshUsers={fetchUsers} closeModal={closeUserModal} />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          user={userToDelete}
          handleDelete={handleDelete}
          closeModal={closeConfirmationModal}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default ListeUsers;
