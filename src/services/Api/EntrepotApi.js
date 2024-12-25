import axios from "axios";

const API_URL = axios.create({
  // @mui material components

  baseURL: "https://kouchcontrol.digitalbox.ci/api/entrepots",
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

// Fonction pour récupérer tous les entrepots
export const getEntrepots = async () => {
  try {
    const response = await API_URL.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des entrepots :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour récupérer un entrepot par ID
export const getEntrepotById = async (id) => {
  try {
    const response = await API_URL.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'entrepot avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour créer un nouvel entrepot
export const createEntrepot = async (data) => {
  try {
    const response = await API_URL.post("/", data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création d'un entrepot :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour mettre à jour un entrepot existant
export const updateEntrepot = async (id, data) => {
  try {
    const response = await API_URL.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'entrepot avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour supprimer un entrepot
export const deleteEntrepot = async (id) => {
  try {
    const response = await API_URL.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'entrepot avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
