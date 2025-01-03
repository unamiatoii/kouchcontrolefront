import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../data/axiosConfig";
import { toast } from "react-toastify";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;

      const response = await api.get("users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user, { dispatch, getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const response = await api.post("users", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchUsers());
      return response.data; // L'utilisateur ajouté
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Modifier un utilisateur
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updates }, { dispatch, getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const response = await api.put(`/users/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Utilisateur modifié avec succès!");
      dispatch(fetchUsers());
      return response.data; // L'utilisateur mis à jour
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Supprimer un utilisateur
export const deleteUser = createAsyncThunk("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/users/${id}`); // Utilisation de `api` pour supprimer un utilisateur
    return id; // Retourne l'ID de l'utilisateur supprimé
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Le slice pour gérer les utilisateurs
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: { data: [] },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Gestion de fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Gestion de addUser
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.data.push(action.payload);
      })
      // Gestion de updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.data.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
          fetchUsers();
        }
      })
      // Gestion de deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
