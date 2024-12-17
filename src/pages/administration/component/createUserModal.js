import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../domain/userSlice";
import { fetchRoles } from "../../../domain/roleSlice";

function CreateUserModal({ open, onClose }) {
  const [newUser, setNewUser] = useState({ name: "", email: "", roleId: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { roles, status } = useSelector((state) => state.roles);

  useEffect(() => {
    if (open && roles.length === 0) {
      dispatch(fetchRoles());
    }
  }, [open, roles, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    if (newUser.name && newUser.email && newUser.roleId) {
      setIsSubmitting(true);
      try {
        await dispatch(addUser(newUser)).unwrap();
        onClose();
      } catch (err) {
        setSnackbarMessage("Erreur lors de la création de l'utilisateur: " + err.message);
        setOpenSnackbar(true);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSnackbarMessage("Veuillez remplir tous les champs");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="name"
            fullWidth
            margin="normal"
            value={newUser.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={newUser.email}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Rôle</InputLabel>
            <Select
              labelId="role-select-label"
              name="roleId"
              value={newUser.roleId}
              onChange={handleInputChange}
              label="Rôle"
            >
              {status === "loading" ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : roles.length > 0 ? (
                roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucun rôle trouvé</MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Annuler
          </Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} />}
          >
            {isSubmitting ? "Création en cours..." : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

CreateUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateUserModal;
