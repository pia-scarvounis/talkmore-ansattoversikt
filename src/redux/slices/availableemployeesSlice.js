// denne henter fra available employees ruten og er ikke bruk nå

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
// legge til api istedenfor axios. når det er klart
// api inneholder header og token med axios
import api from '../../backend/apiToken/axiosInstance.js';

//fetch for backend url /api/availableemployees
export const fetchAvailableEmployees = createAsyncThunk(
    'availableEmployees/fetchAvailableEmployees',
        async(selectedDate, thunkAPI) =>{
            try{
                const response = await api.get(`http://localhost:3000/api/availableemployees?date=${selectedDate}`);
                return response.data;
            }catch(error){
                return thunkAPI.rejectWithValue(error.response.data);
            }
        }
);

const availableEmployeesSlice = createSlice({
    name: 'availableEmployees', 
    initialState: {
        //Data som skal holde på tilgjengelige ansatte etter dispatch fetch i komponentet
        data:[],
        loading: false,
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAvailableEmployees.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchAvailableEmployees.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
          })
          .addCase(fetchAvailableEmployees.rejected, (state, action) => {
            state.error = action.payload || 'Noe gikk galt';
            state.loading = false;
          });     
    },
});
export default availableEmployeesSlice.reducer;