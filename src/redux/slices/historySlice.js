import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// legge til api istedenfor axios. når det er klart
import api from "../../backend/apiToken/axiosInstance.js";

//SLICE FOR HISTORIKK
// Historikk for en ansatt

//async THUNK som skal returnere en promise og håndtere asynkrone handlinger/fetch
//https://redux.js.org/tutorials/fundamentals/part-6-async-logic

//fetch med å hente historikken til valgt ansatt (:id)
export const fetchEmployeeHistory = createAsyncThunk(
  "employeeHistory/fetchEmployeeHistory",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/employee/history/${employeeId}`
      );
      console.log("Response fra API employeeHistoryGet:", response.data);
      return response.data;
    } catch (error) {
      console.error(" Feil ved henting av historikk:", error);
      return rejectWithValue(error.response?.data || "Ukjent feil");
    }
  }
);

const employeeHistorySlice = createSlice({
  name: "employeeHistory",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch loader
      .addCase(fetchEmployeeHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      //fetch suksess
      .addCase(fetchEmployeeHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      //fetch failed
      .addCase(fetchEmployeeHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default employeeHistorySlice.reducer;
