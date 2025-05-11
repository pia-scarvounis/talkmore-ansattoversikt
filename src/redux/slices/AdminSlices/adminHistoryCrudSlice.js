import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// legge til api istedenfor axios. når det er klart / api har header og token
import api from '../../../backend/apiToken/axiosInstance.js';

//async THUNK som skal returnere en promise og håndtere asynkrone handlinger/fetch
//https://redux.js.org/tutorials/fundamentals/part-6-async-logic

//Oppdatere historikk felter i changeLog - kun admin
export const updateChangeLog = createAsyncThunk(
    'changeLog/updateChangeLog',
    async({ changleLogId, updatedFields }, {rejectedWithValue}) => {
        try{
            const response = await api.patch(`http://localhost:3000/api/history/${changleLogId}`,
            updatedFields,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Oppdatert historikk;', response.data);
        return response.data;

        }catch(err){
            return rejectedWithValue(err.response?.data || 'Feil bed oppdatering av historikk felt')
        }
    }
);

const changeLogSlice = createSlice({
    name: 'changeLog',
    initialState:{
        updating: false,
        success: false,
        error: null
    },
    reducers:{
        resetChangeLogState: (state) => {
            state.updating = false,
            state.success = false,
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateChangeLog.pending, (state) => {
                state.updating = true;
                state.success = false;
                state.error = null;
            })
            .addCase(updateChangeLog.fulfilled, (state, action) => {
                state.updating = false;
                state.success = true;
            })
            .addCase(updateChangeLog.rejected, ( state, action ) => {
                state.updating = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

export default changeLogSlice.reducer;