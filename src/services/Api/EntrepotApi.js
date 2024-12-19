export const fetchEntrepot = createAsyncThunk(
    "roles/fetchEntrepot",
    async (_, { rejectWithValue, getState }) => {
      try {
        const { auth } = getState();
        const token = auth?.token;
        const response = await api.get("entrepot", {
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
  