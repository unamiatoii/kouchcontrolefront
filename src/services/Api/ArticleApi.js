import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://kouchcontrol.digitalbox.ci/api/articles",
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

// Fonction pour récupérer tous les articles
export const getArticles = async () => {
  try {
    const response = await API_URL.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des articles :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour récupérer un article par ID
export const getArticleById = async (id) => {
  try {
    const response = await API_URL.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'article avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour créer un nouvel article
export const createArticle = async (data) => {
  try {
    const response = await API_URL.post("/", data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création d'un article :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour mettre à jour un article existant
export const updateArticle = async (id, data) => {
  try {
    const response = await API_URL.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'article avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour supprimer un article
export const deleteArticle = async (id) => {
  try {
    const response = await API_URL.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'article avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fonction pour transferer un ou plusieurs article(s) vers un entrepot ou un chantier
export const transfertArticleToEntrepotOrChantier = async (data) => {
  try {
    const response = await API_URL.post("/transfert", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du transfert :", error.response?.data || error.message);
    throw error;
  }
};
// Fonction pour transferer un ou plusieurs article(s) vers un entrepot vers chantier ou un chantier vers entrepot
export const transferArticlesEntrepotToChantierOrChantierToEntrepot = async (payload) => {
  try {
    const response = await API_URL.post("/transfert_stock", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du transfert :", error.response?.data || error.message);
    throw error;
  }
};
