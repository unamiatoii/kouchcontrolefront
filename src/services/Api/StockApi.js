import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://kouchcontrol.digitalbox.ci/api/stocks",
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

// Fonction pour récupérer tous les stocks
export const getStocks = async () => {
  try {
    const response = await API_URL.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des stocks :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour récupérer un stock par ID
export const getStockById = async (id) => {
  try {
    const response = await API_URL.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du stock avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour créer un nouvel stock
export const createStock = async (data) => {
  try {
    const response = await API_URL.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création d'un stock :", error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour mettre à jour un stock existant
export const updateStock = async (id, data) => {
  try {
    const response = await API_URL.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'stock avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour supprimer un stock
export const deleteStock = async (id) => {
  try {
    const response = await API_URL.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'stock avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Voir le stock d'un chantier
export const getStockChantier = async (id) => {
  try {
    const response = await API_URL.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la recuperation du stock :",
      error.response?.data || error.message
    );
    throw error;
  }
};
// Voir le stock d'un entrepot
export const getStockEntrepot = async (id) => {
  try {
    const response = await API_URL.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la recuperation du stock :",
      error.response?.data || error.message
    );
    throw error;
  }
};
