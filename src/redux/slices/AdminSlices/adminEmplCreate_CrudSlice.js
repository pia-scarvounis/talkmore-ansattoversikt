import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
//denne skal settes inn senere for token
import api from '../../../backend/apiToken/axiosInstance';

// SLICE for å opprette bruker av Admin

//Create employee (admin)
export const createEmployee = createAsyncThunk(
    'employee/createEmployee',
    async(employeeData, { rejectWithValue }) => {
        try{
            const response = await axios.post('http://localhost:3000/api/employee', employeeData);
            return response.data.employee;

        }catch(err){
            return rejectWithValue(err.response?.data || 'Feil ved opprettelse');
        }
    }
);

const createEmployeeSlice = createSlice({
    name: 'createEmployee',
    initialState: {
        employee: null,
        loading: false,
        success: false,
        error: null,
    }, 
    reducers: {
        //resette data
        resetCreateEmployeeState: (state) => {
            state.employee = null;
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.employee = action.payload;
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Feil ved oppretting av ansatt";
            })
    }
});

export const {resetCreateEmployeeState} = createEmployeeSlice.actions;
export default createEmployeeSlice.reducer;
