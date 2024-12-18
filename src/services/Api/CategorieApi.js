import axios from "axios";

// Configuration de l'instance Axios
const API_URL = axios.create({
  baseURL: "https://kouchcontrol.digitalbox.ci/api/categories",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fonction pour vérifier si le token existe dans le localStorage
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
    console.log("Token dans la requête :", token);
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

// Fonction pour récupérer toutes les catégories
export const getCategories = async () => {
  try {
    const response = await API_URL.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des catégories :",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await API_URL.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la catégorie avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await API_URL.post("/", data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création d'une catégorie :",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await API_URL.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la catégorie avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await API_URL.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la catégorie avec ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
