//Slice for innlogging og utlogging

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// api har header og token
import api from "../../../backend/apiToken/axiosInstance.js";

//hente token fra localstorage
const tokenFromStorage = localStorage.getItem("token");
const userFromToken = tokenFromStorage ? jwtDecode(tokenFromStorage) : null;

//Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async ({ username, password }, { rejectedWithValue }) => {
    try {
      const response = await api.post("http://localhost:3000/api/auth/login", {
        username,
        password,
      });
      const token = response.data.token;

      localStorage.setItem("token", token);
      return token;
    } catch (err) {
      const message = err.response?.data?.message || "Innlogging feilet";
      return rejectedWithValue(message);
    }
  }
);

//SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: tokenFromStorage || null,
    //bruker som er logget inn
    user: userFromToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      (state.token = null), (state.user = null);
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        const decodedToken = jwtDecode(action.payload);

        state.user = {
          userId: decodedToken.userId,
          username: decodedToken.username,
          role: decodedToken.role,
          employee_name: decodedToken.employee_name || "Ukjent navn",
        };

        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.error = action.payload;
      });
  },
});
export const { logout } = authSlice.actions;

export default authSlice.reducer;
