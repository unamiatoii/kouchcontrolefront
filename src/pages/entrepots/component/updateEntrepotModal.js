import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import MDButtonSpinner from "components/MDButtonSpinner.js";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchUsers } from "domain/userSlice";
import { fetchRoles } from "domain/roleSlice";
import { Password, Settings } from "@mui/icons-material";

function EditUserModal({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role_id || "", // Utilise l'ID du rôle
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { roles, status } = useSelector((state) => state.roles);

  useEffect(() => {
    if (open) {
      dispatch(fetchRoles());
    }
  }, [open, dispatch]);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role_id || "",
      password: "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = user?.id;
      if (!userId) throw new Error("L'identifiant de l'utilisateur est requis");

      await dispatch(updateUser({ id: userId, updates: formData }));
      await dispatch(fetchUsers());

      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Échec de la mise à jour :", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          background: "whitesmoke",
          borderRadius: 2,
          maxWidth: 400,
          mx: "auto",
          mt: 10,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" align="center" mb={3} fontWeight="bold">
          Modifier l&apos;utilisateur
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderRadius: 2,
            border: "none",
          }}
        >
          <TextField
            label="Nom"
            name="name"
            sx={{ width: "35%", height: "auto" }}
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email"
            name="email"
            sx={{ width: "60%" }}
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

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
            value={formData.password}
            onChange={handleChange}
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
              value={formData.role_id}
              onChange={handleChange}
              label="Rôle"
            >
              {status === "loading" ? (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                  <CircularProgress />
                </div>
              ) : roles.length > 0 ? (
                roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1).toLowerCase()}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucun rôle trouvé</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={3}>
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
          <Box display="flex" justifyContent="space-between" sx={{ width: "40%" }}>
            <MDButtonSpinner
              onClick={handleSave}
              variant="contained"
              color="success"
              loading={loading}
            >
              Modifier
            </MDButtonSpinner>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

EditUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    role_id: PropTypes.string, // Utilise roleId pour l'ID du rôle
  }),
  onSave: PropTypes.func.isRequired,
};

EditUserModal.defaultProps = {
  user: null,
};

export default EditUserModal;
