import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

//Hente ut avdelinger, teams, og stillinger 
export const fetchMetaData = createAsyncThunk(
    'metaData/fetchMetaData',
    async(_, {rejectedWithValue}) => {
        try{
            const [departmentsRes, teamsRes, posistionsRes] = await Promise.all([
                axios.get('http://localhost:3000/api/metaData/departments'),
                axios.get('http://localhost:3000/api/metaData/teams'),
                axios.get('http://localhost:3000/api/metaData/posistions'),
                axios.get('http://localhost:3000/api/metaData/licenses')
            ]);
            return{
                departments: departmentsRes.data,
                teams: teamsRes.data,
                posistions: posistionsRes.data
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
            })
            .addCase(fetchMetaData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Kunne ikke hente meta data, avd, team, stillings';
            });
    }
});

export default metaDataSlice.reducer;

