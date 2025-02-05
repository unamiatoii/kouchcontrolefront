import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserChantier } from "services/Api/UserApi";

const ChantierContext = createContext();

// eslint-disable-next-line react/prop-types
export const ChantierProvider = ({ children }) => {
  const [chantierName, setChantierName] = useState(null);

  // Charger le chantier de l'utilisateur connecté au montage
  useEffect(() => {
    const fetchChantier = async () => {
      try {
        const chantier = await getUserChantier();
        setChantierName(chantier?.name || "Chantier-Inconnu"); // Par défaut, un chantier inconnu
      } catch (error) {
        console.error("Erreur lors du chargement du chantier :", error);
      }
    };

    fetchChantier();
  }, []);

  return (
    <ChantierContext.Provider value={{ chantierName, setChantierName }}>
      {children}
    </ChantierContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useChantier = () => {
  return useContext(ChantierContext);
};
