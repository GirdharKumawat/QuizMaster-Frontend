import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isAuthenticated: false,
  id: null,
  username: "",
  email: "", 
  role: "",
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
      const { _id, username, email, role } = action.payload;
      if (_id) state.id = _id  ;
      if (username) state.username = username;
      if (email) state.email = email;
      if (role) state.role = role;
    },
  },
});

export const { setLoading, setIsAuthenticated, setUser } = authSlice.actions;
export default authSlice.reducer;