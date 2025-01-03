import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://kouchcontrol.digitalbox.ci/api/movements",
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Aucun token trouvé, veuillez vous connecter.");
  }
  return token;
};

API_URL.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Aucun token trouvé, impossible d'envoyer la requête.");
      return Promise.reject("Token manquant");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Fonction pour récupérer tous les mouvements
export const getMouvements = async () => {
  try {
    const response = await API_URL.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des mouvements :",
      error.response?.data || error.message
    );
    throw error;
  }
};
