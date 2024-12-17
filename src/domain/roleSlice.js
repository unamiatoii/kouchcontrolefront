import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../data/axiosConfig";

// Define an initial state for roles
const initialState = {
  roles: [],
  loading: false,
  error: null,
};

// Create an asynchronous thunk to fetch roles
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const response = await api.get("roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create the slice
const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload; // Save the roles from the API response
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message if API request fails
      });
  },
});

// Export the reducer to be used in your store
export default roleSlice.reducer;
