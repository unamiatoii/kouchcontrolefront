import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../data/axiosConfig";

// Fonction pour la connexion
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { email, password });
      return response.data; // Retourne les données utilisateur
    } catch (error) {
      return rejectWithValue(error.response.data); // Gestion des erreurs
    }
  }
);

// Slice pour la gestion de l'authentification
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.token = token; // Stocke le token
        state.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role?.name, // Transforme le rôle si nécessaire
        };
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
