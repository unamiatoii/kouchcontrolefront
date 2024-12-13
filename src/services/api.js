import axios from "axios";
import { saveToken } from "../utils/auth";

const API_URL = "https://api-contact.digitalbox.ci/api";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    saveToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const API_CONTACT_URL = `${API_URL}/contact`;

export const getContacts = async () => {
  try {
    const response = await axios.get(API_CONTACT_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const getContactById = async (id) => {
  try {
    const response = await axios.get(`${API_CONTACT_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contact with ID ${id}:`, error);
    throw error;
  }
};

export const createContact = async (data) => {
  try {
    const response = await axios.post(API_CONTACT_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

export const updateContact = async (id, data) => {
  try {
    const response = await axios.put(`${API_CONTACT_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await axios.delete(`${API_CONTACT_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    throw error;
  }
};
