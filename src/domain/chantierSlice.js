import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../data/axiosConfig";

// Thunk pour récupérer le chantier de l'utilisateur connecté
export const fetchChantier = createAsyncThunk(
  "chantier/fetchChantier",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;

      const response = await api.get("/users/chantier", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.chantier.name;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de la récupération du chantier"
      );
    }
  }
);

const chantierSlice = createSlice({
  name: "chantier",
  initialState: {
    chantierName: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChantier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChantier.fulfilled, (state, action) => {
        state.loading = false;
        state.chantierName = action.payload;
      })
      .addCase(fetchChantier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chantierSlice.reducer;
