import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://kouchcontrol.digitalbox.ci/api/chantiers",
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

// Fonction pour récupérer tous les chantiers
export const getChantiers = async () => {
  try {
    const response = await API_URL.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des chantiers :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour récupérer un chantier par ID
export const getChantierById = async (id) => {
  try {
    const response = await API_URL.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'chantier avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour créer un nouvel chantier
export const createChantier = async (data) => {
  try {
    const response = await API_URL.post("/", data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création d'un chantier :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour mettre à jour un chantier existant
export const updateChantier = async (id, data) => {
  try {
    const response = await API_URL.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'chantier avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour supprimer un chantier
export const deleteChantier = async (id) => {
  try {
    const response = await API_URL.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'chantier avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
