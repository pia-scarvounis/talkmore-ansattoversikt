import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//SLICE for EMPLOYEES

//async THUNK som skal returnere en promise og håndtere asynkrone handlinger/fetch
//https://redux.js.org/tutorials/fundamentals/part-6-async-logic

export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async () => {
        const response = await axios.get('/api/employes');
        return response.data;
    }
);

const employeeSlice = createSlice({
    name: 'employees',
    initialState:{
        data:[],
        loading: false,
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            //Når fetchen ikke er ferdig -> loader
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            //når fetchen er fullfilled henter den ut data (action.payload)
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            //Når fetchen feiler
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})
