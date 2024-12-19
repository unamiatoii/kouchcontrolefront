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
