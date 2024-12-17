import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, TextField, Button, Typography, InputAdornment } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import MDButtonSpinner from "components/MDButtonSpinner.js";
import { useDispatch } from "react-redux";
import { updateUser } from "domain/userSlice"; // Assuming updateUser is an action

function EditUserModal({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

  const handleSave = async () => {
    setLoading(true);
    try {
      // Ensure we pass the user ID along with the updates
      const userId = user?.id; // Get user ID from the user prop
      if (!userId) {
        throw new Error("User ID is required for updating the user");
      }

      // Dispatch the updateUser action with both ID and updates
      await dispatch(updateUser({ id: userId, updates: formData }));

      onSave(formData); // Optional: callback to parent for further handling
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update user:", error.message);
    } finally {
      setLoading(false); // Set loading to false after the process ends
    }
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
    </Modal>
  );
}

EditUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired, // Ensure the user has an 'id'
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

EditUserModal.defaultProps = {
  user: null,
};

export default EditUserModal;
