import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createChantier, updateChantier } from "services/Api/ChantierApi";
import { getChefsChantiers } from "services/Api/UserApi";

const ChantierModal = ({ chantier, refreshChantiers, closeModal }) => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chefsChantiers, setChefsChantiers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les chefs de chantier au montage du composant
  useEffect(() => {
    fetchChefsChantiers();
  }, []);

  // Charger les données du chantier sélectionné ou réinitialiser le formulaire
  useEffect(() => {
    if (chantier) {
      setName(chantier.name || "");
      setUserId(chantier.user_id || "");
      setBudget(chantier.budget || "");
      setLocation(chantier.location || "");
      setStartDate(chantier.start_date || "");
      setEndDate(chantier.end_date || "");
    } else {
      resetForm();
    }
  }, [chantier]);
  const fetchChefsChantiers = async () => {
    try {
      const data = await getChefsChantiers();
      console.log("Données récupérées :", data);
      setChefsChantiers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Erreur lors de la récupération des chefs chantiers :", error);
      setChefsChantiers([]);
    }
  };
  const resetForm = () => {
    setName("");
    setUserId("");
    setBudget("");
    setLocation("");
    setStartDate("");
    setEndDate("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const chantierData = {
        name,
        user_id: userId,
        budget,
        location,
        start_date: startDate,
        end_date: endDate,
      };

      if (chantier) {
        await updateChantier(chantier.id, chantierData);
        toast.success("Chantier modifié avec succès.");
      } else {
        await createChantier(chantierData);
        toast.success("Article enregistré avec succès.");
      }

      refreshChantiers();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du chantier :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      id="chantierModal"
      aria-labelledby="chantierModalLabel"
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
                <label className="form-label">Nom du chantier</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Localisation</label>
                <input
                  type="text"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Budget</label>
                <input
                  type="number"
                  className="form-control"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date de début</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date de fin</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Chef Chantier</label>
                <select
                  className="form-control form-select"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un chef chantier</option>
                  {Array.isArray(chefsChantiers) && chefsChantiers.length > 0 ? (
                    chefsChantiers.map((chef) => (
                      <option key={chef.id} value={chef.id}>
                        {chef.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Aucun chef chantier disponible</option>
                  )}
                </select>
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
                ) : chantier ? (
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

ChantierModal.propTypes = {
  chantier: PropTypes.object,
  refreshChantiers: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ChantierModal;
