import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://kouchcontrol.digitalbox.ci/api/users",
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

// Fonction pour récupérer tous les chefs chantiers
export const getChefsChantiers = async () => {
  try {
    const response = await API_URL.get("/chefs-chantiers");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des chantiers :",
      error.response?.data || error.message
    );
    throw error;
  }
};
// Fonction pour récupérer le chantier
export const getUserChantier = async () => {
  try {
    const response = await API_URL.get("/chantier");
    return response.data;
    console.log(response.data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du chantier :",
      error.response?.data || error.message
    );
    throw error;
  }
};
// Fonction pour récupérer tous les utilisateurs
export const getUsers = async () => {
  try {
    const response = await API_URL.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour récupérer un utilisateur par ID
export const getUserById = async (id) => {
  try {
    const response = await API_URL.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'utilisateur avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour créer un nouvel utilisateur
export const createUser = async (data) => {
  try {
    const response = await API_URL.post("/", data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création d'un utilisateur :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour mettre à jour un utilisateur existant
export const updateUser = async (id, data) => {
  try {
    const response = await API_URL.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'utilisateur avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUser = async (id) => {
  try {
    const response = await API_URL.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'utilisateur avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getActivitiesHistorique = async () => {
  try {
    const response = await API_URL.get("/activities/historique");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des activités :",
      error.response?.data || error.message
    );
    throw error;
  }
};
