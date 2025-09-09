import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../axios";
 

// Create an async thunk for checking authentication
export const checkAuthentication = createAsyncThunk(
  "user/checkAuthentication",

  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosAPI.get("user/isauthenticated/");
  // Prefer returning an explicit boolean from the API response when possible.
  // If the API doesn't provide a field, default to false to avoid assuming auth.
  return Boolean(res.data?.authenticated ?? false);
    } catch (err) {
      console.error("Auth check failed", err.response?.data);
      return rejectWithValue(false);
    }
  }
);
console.log("checkAuthentication thunk created");
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
  // Coerce to boolean to avoid undefined being written into the state.
  state.isAuthenticated = action.payload;
    },

    setUser(state, action) {
      const { id, username, email } = action.payload;
      if (id !== undefined) state.id = id;
      if (username !== undefined) state.username = username;
      if (email !== undefined) state.email = email;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthentication.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthentication.fulfilled, (state, action) => {
        state.loading = false;
  // Ensure the value stored is always a boolean.
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
