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
  InputAdornment,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../domain/userSlice";
import { fetchRoles } from "../../../domain/roleSlice";
import { Password, Person, Plumbing, Settings } from "@mui/icons-material";

function CreateUserModal({ open, onClose }) {
  const [newUser, setNewUser] = useState({ name: "", email: "", role_id: "", password: "" });
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
    if (newUser.name && newUser.email && newUser.role_id) {
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
      <Box>
        <Dialog
          sx={{
            p: 4,
            background: "transparent",
            borderRadius: 2,
            border: "none",
            maxWidth: 550,
            mx: "auto",
            height: "auto",
          }}
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderRadius: 2,
                border: "none",
              }}
            >
              <TextField
                sx={{ width: "45%" }}
                label="Nom & prenoms"
                name="name"
                margin="normal"
                value={newUser.name}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                sx={{ width: "50%" }}
                label="Email"
                name="email"
                margin="normal"
                value={newUser.email}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>{" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderRadius: 2,
                border: "none",
              }}
            >
              <TextField
                sx={{ width: "65%" }}
                label="Mot de passe"
                name="password"
                margin="normal"
                value={newUser.password}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Password color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ width: "30%", height: "auto" }} margin="normal">
                <InputLabel
                  id="role-select-label"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Settings color="primary" />
                      </InputAdornment>
                    ),
                  }}
                >
                  Rôle
                </InputLabel>
                <Select
                  sx={{ height: "100%" }}
                  labelId="role-select-label"
                  name="role_id"
                  value={newUser.role_id}
                  onChange={handleInputChange}
                  label="Rôle"
                >
                  {status === "loading" ? (
                    <div style={{ textAlign: "center", marginTop: "50px" }}>
                      <CircularProgress />
                    </div>
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
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              color="secondary"
              sx={{
                backgroundColor: "orange",
              }}
            >
              Annuler
            </Button>
            <Button
              sx={{ color: "white" }}
              onClick={handleCreateUser}
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? "En cours..." : "Créer"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
