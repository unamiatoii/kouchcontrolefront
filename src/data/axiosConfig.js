// src/data/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://kouchcontrol.digitalbox.ci/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
