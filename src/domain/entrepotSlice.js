import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../data/axiosConfig";

// Define initial state for entrepots
const initialState = {
  entrepots: [],
  loading: false,
  error: null,
};

// Async thunks for CRUD operations
export const fetchEntrepots = createAsyncThunk(
  "entrepots/fetchEntrepots",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const response = await api.get("/entrepots", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEntrepot = createAsyncThunk(
  "entrepots/createEntrepot",
  async (newEntrepot, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const response = await api.post("/entrepots", newEntrepot, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEntrepot = createAsyncThunk(
  "entrepots/updateEntrepot",
  async ({ id, updatedData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const response = await api.put(`/entrepots/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEntrepot = createAsyncThunk(
  "entrepots/deleteEntrepot",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      await api.delete(`/entrepots/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const transferStock = createAsyncThunk(
  "entrepots/transferStock",
  async (transferData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const response = await api.post("/entrepots/transfer", transferData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
const entrepotSlice = createSlice({
  name: "entrepots",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntrepots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntrepots.fulfilled, (state, action) => {
        state.loading = false;
        state.entrepots = action.payload;
      })
      .addCase(fetchEntrepots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEntrepot.fulfilled, (state, action) => {
        state.entrepots.push(action.payload);
      })
      .addCase(updateEntrepot.fulfilled, (state, action) => {
        const index = state.entrepots.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.entrepots[index] = action.payload;
        }
      })
      .addCase(deleteEntrepot.fulfilled, (state, action) => {
        state.entrepots = state.entrepots.filter((e) => e.id !== action.payload);
      })
      .addCase(transferStock.fulfilled, (state, action) => {
        // Handle stock transfer response if needed
      });
  },
});

// Export the reducer
export default entrepotSlice.reducer;
