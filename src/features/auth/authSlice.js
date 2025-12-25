import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi"; // Import the API Layer

// Create an async thunk for checking authentication
export const checkAuthentication = createAsyncThunk(
  "user/checkAuthentication",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.checkAuth();
      // Prefer returning an explicit boolean from the API response
      return Boolean(res.data?.authenticated ?? false);
    } catch (err) {
      console.error("Auth check failed", err.response?.data);
      return rejectWithValue(false);
    }
  }
);

const initialState = {
  loading: false,
  isAuthenticated: false,
  id: null,
  username: "",
  email: "", 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },

    setIsAuthenticated(state, action) {
      state.isAuthenticated = !!action.payload;
    },

    setUser(state, action) {
      const { _id, id, username, email } = action.payload;
      // robust check for both id formats
      if (_id || id) state.id = _id || id;
      if (username) state.username = username;
      if (email) state.email = email;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthentication.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthentication.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuthentication.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setLoading, setIsAuthenticated, setUser } = authSlice.actions;
export default authSlice.reducer;