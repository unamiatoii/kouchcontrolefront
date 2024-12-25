import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser, updateUser } from "services/Api/UserApi";
import { getRoles } from "services/Api/RoleApi";

const UserModal = ({ user, refreshUsers, closeModal }) => {
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setRoleId(user.role_id || "");
      setEmail(user.email || "");
      setPassword(user.password || "");
    } else {
      resetForm();
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  const resetForm = () => {
    setName("");
    setRoleId("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = {
        name,
        role_id: roleId,
        email,
        password,
      };

      if (user) {
        await updateUser(user.id, userData);
        toast.success("Utilisateur modifié avec succès.");
      } else {
        await createUser(userData);
        toast.success("Utilisateur enregistré avec succès.");
      }

      refreshUsers();
      closeModal();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de l'utilisateur.");
      console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      id="UserModal"
      aria-labelledby="UserModalLabel"
      aria-hidden="false"
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: "50%",
          animation: "scaleIn 0.3s ease-in-out",
        }}
      >
        <div className="modal-content" style={{ borderRadius: "15px" }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom et prénom(s)</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-control form-select"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un rôle</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                  type="text"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Chargement...
                  </>
                ) : user ? (
                  "Mettre à jour"
                ) : (
                  "Ajouter"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

UserModal.propTypes = {
  user: PropTypes.object,
  refreshUsers: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default UserModal;
