import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
// legge til api istedenfor axios. når det er klart
//henter token header i api/  api har header og token
import api from '../../backend/apiToken/axiosInstance.js';


//Hente ut avdelinger, teams, og stillinger 
export const fetchMetaData = createAsyncThunk(
    'metaData/fetchMetaData',
    async(_, {rejectedWithValue}) => {
        try{
            const [departmentsRes, teamsRes, posistionsRes, licensesRes] = await Promise.all([
                api.get('http://localhost:3000/api/metaData/departments'),
                api.get('http://localhost:3000/api/metaData/teams'),
                api.get('http://localhost:3000/api/metaData/posistions'),
                api.get('http://localhost:3000/api/metaData/licenses')
            ]);
            return{
                departments: departmentsRes.data,
                teams: teamsRes.data,
                posistions: posistionsRes.data,
                licenses: licensesRes.data
            }
        }catch(error){
            return rejectedWithValue(error.response.data);
        }
    }
);

const metaDataSlice = createSlice({
    name: 'metaData',
    initialState: {
        departments: [],
        teams: [],
        posistions: [],
        licenses: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMetaData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMetaData.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload.departments;
                state.teams = action.payload.teams;
                state.posistions = action.payload.posistions;
                state.licenses = action.payload.licenses;
            })
            .addCase(fetchMetaData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Kunne ikke hente meta data, avd, team, stillings';
            });
    }
});

export default metaDataSlice.reducer;

