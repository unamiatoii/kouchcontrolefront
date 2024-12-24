import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createEntrepot, updateEntrepot } from "services/Api/EntrepotApi";

const EntrepotModal = ({ entrepot, refreshEntrepots, closeModal }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [responsable, setResponsable] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entrepot) {
      setName(entrepot.name || "");
      setAddress(entrepot.address || "");
      setResponsable(entrepot.responsable || "");
    } else {
      resetForm();
    }
  }, [entrepot]);

  const resetForm = () => {
    setName("");
    setAddress("");
    setResponsable("");
  };

  const showToast = (type, message) => {
    setToast({ type, message, visible: true });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const entrepotData = { name, address, responsable };

      if (entrepot) {
        await updateEntrepot(entrepot.id, entrepotData);
        toast.success("Entrepot modifié avec succès.");
      } else {
        await createEntrepot(entrepotData);
        toast.success("Entrepot enregistré avec succès.");
      }

      refreshEntrepots();

      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'entrepôt :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modal */}
      <div
        className="modal fade show"
        id="EntrepotModal"
        aria-labelledby="EntrepotModalLabel"
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
                  <label className="form-label">Nom de l entrepôt</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Rue I90, Abidjan, Cocody, Côte d'Ivoire"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nom du responsable</label>
                  <input
                    type="text"
                    className="form-control"
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
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
                  ) : entrepot ? (
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
    </>
  );
};

EntrepotModal.propTypes = {
  entrepot: PropTypes.object,
  refreshEntrepots: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default EntrepotModal;
