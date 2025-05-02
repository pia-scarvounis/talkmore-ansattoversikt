//Slice for innlogging og utlogging

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from  'axios';
import api from '../../../backend/apiToken/axiosInstance.js';

//hente token fra localstorage
const tokenFromStorage = localStorage.getItem('token');

//Login 
export const loginUser = createAsyncThunk(
    'auth/loginUser',

    async({username, password}, {rejectedWithValue}) =>{
        try{    
            const response = await api.post('http://localhost:3000/api/auth/login', 
                {username, password});
            const token = response.data.token;

            localStorage.setItem('token', token);
            return token;

        }catch(err){
            const message = err.response?.data?.message || 'Innlogging feilet';
            return rejectedWithValue(message);
        }
    }
)

//SLICE
const authSlice = createSlice({
    name: 'auth',
    initialState:{
        token: tokenFromStorage || null,
        loading: false,
        error: null
    },
    reducers:{
        logout: state => {
            state.token = null,
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, state =>{
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) =>{
                state.loading = false;
                state.token = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action)=>{
                state.loading = false;
                state.token = null;
                state.error = action.payload;
            })
    }
});

export default authSlice.reducer;