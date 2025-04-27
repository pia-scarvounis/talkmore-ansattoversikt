import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//async THUNK som skal returnere en promise og håndtere asynkrone handlinger/fetch
//https://redux.js.org/tutorials/fundamentals/part-6-async-logic

//Her ligger slice for UPDATE, POST, DELETE kun admin cruds for employees

//UPDATE EMPLOYEE (Admin)
export const updateEmployee = createAsyncThunk(
    'updateEmployee/updateEmployee',
    async ({ id, updatedEmployeeData}, {rejectedWithValue}) =>{
        try{
            const response = await axios.get(`http://localhost:3000/api/employee/${id}`, updatedEmployeeData)
            console.log('Response fra API updateEmployee', response.data);
            return response.data;
        }catch(error){
            return rejectedWithValue(error.response?.data || 'Noe gikk galt');
        }
    }
)

const updateEmployeeSlice = createSlice({
    name: 'updateEmployee',
    initialState:{
        loading: false,
        success: false, 
        error: null
    },
    reducers:{
        //den kan brukes til å nullstille statuser etter update -gpt
        resetUpdateState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(updateEmployee.pending, (state) =>{
                    state.loading = true;
                    state.success = false;
                    state.error = null;
                })
                .addCase(updateEmployee.fulfilled, (state) =>{
                    state.loading = false;
                    state.success = true;
                    state.error = null;
                })
                addCase(updateEmployee.rejected, (state, action) =>{
                    state.loading = false;
                    state.success = false;
                    state.error = action.payload || 'Oppdatering feilet';
                });
        }
    
});

export const {resetUpdateState} = updateEmployeeSlice.actions;

export default updateEmployeeSlice.reducer;