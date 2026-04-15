// Redux Slice for å administrere lisenser
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../backend/apiToken/axiosInstance.js";
import { fetchMetaData } from "../metaDataCrudsSlice";

// Hent lisenser (hentes i metaDataSlice)
// Legg til ny lisens
export const createLicense = createAsyncThunk(
  "license/createLicense",
  async (newLicense, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(
        "/license",
        newLicense
      );
      dispatch(fetchMetaData());
      console.log("Lisens opprettet:", response.data);
      return response.data;
    } catch (err) {
      console.error(
        "Feil ved opprettelse:",
        err.response ? err.response.data : err.message
      );
      return rejectWithValue(
        err.response ? err.response.data : "Feil ved opprettelse"
      );
    }
  }
);

// Oppdater lisens
export const updateLicense = createAsyncThunk(
  "license/updateLicense",
  async ({ licenseId, updateData }, { dispatch, rejectWithValue }) => {
    try {
      await api.put(
        `/license/${licenseId}`,
        updateData
      );
      dispatch(fetchMetaData());
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slett lisens
export const deleteLicense = createAsyncThunk(
  "license/deleteLicense",
  async (licenseId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/license/${licenseId}`);
      dispatch(fetchMetaData());
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slice for administrasjon av lisenser
const licenseCrudSlice = createSlice({
  name: "licenseCruds",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("license/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("license/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("license/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Noe gikk galt med lisens handling";
        }
      );
  },
});

export default licenseCrudSlice.reducer;
