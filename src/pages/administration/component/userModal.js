import React from "react";
import PropTypes from "prop-types";
import { Modal, Box, TextField, Button, Typography, InputAdornment } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import MDButtonSpinner from "components/MDButtonSpinner.js";

function EditUserModal({ open, onClose, user, onSave }) {
  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  React.useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          background: "whitesmoke",
          borderRadius: 2,
          border: "none",
          maxWidth: 400,
          mx: "auto",
          mt: 10,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" align="center" mb={3} color="white" fontWeight="bold">
          Modifier l&apos;utilisateur
        </Typography>
        <TextField
          label="Nom"
          name="name"
          fullWidth
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
          fullWidth
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
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button onClick={onClose} variant="error" color="error">
            Annuler
          </Button>
          <MDButtonSpinner onClick={handleSave} variant="contained" color="success">
            Modifier
          </MDButtonSpinner>
        </Box>
      </Box>
    </Modal>
  );
}

EditUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

EditUserModal.defaultProps = {
  user: null,
};

export default EditUserModal;
