import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateEmployee } from './adminCrudsSlice';

//SLICE for EMPLOYEES

//async THUNK som skal returnere en promise og håndtere asynkrone handlinger/fetch
//https://redux.js.org/tutorials/fundamentals/part-6-async-logic

export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async (_, { rejectWithValue }) => {

        try{
            const response = await axios.get('http://localhost:3000/api/employees');
            console.log('Respons fra API fetchEmployee:', response.data);
            return response.data;
        }catch{
            return rejectWithValue(error.response.data);
        }
        
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
            })
            //setter inn det nye oppdaterte objektet i employees
            .addCase(updateEmployee.fulfilled, (state, action) =>{
                const updated = action.payload.employee;
                const index = state.data.findIndex(emp => emp.employee_id === updatet.employee_id);
                if(index !==1){
                    state.data[index] = updated;
                }
            })
    }
});

export default employeeSlice.reducer;
