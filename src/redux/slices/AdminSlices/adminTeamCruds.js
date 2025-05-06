// SLICE for POST, PUT og DELETE TEAMS for Admin
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
//setter denne når ruter beskytter er lagt denne henter token for url fetchen til admin/teamleder
import api from '../../../backend/apiToken/axiosInstance.js';
//importerer fetchMetadata da get teams ligger i en annen slice, den skal helst ikke det men når vi skal hente ut mye på en gang
//har vi laget egen get for avdeling, teams, stillinger og lisenser i en slice
//Så vi må hente inn metadata og oppdatere arrayet for teams i metadata slice

import { fetchMetaData } from '../metaDataCrudsSlice.js';


//Opprett nytt team 
export const createTeam = createAsyncThunk(
    'team/createTeam', async (newTeam) =>{
        const response = await axios.post('http://localhost:3000/api/team', newTeam);
        return response.data;
    });

//Oppdatere nytt team
export const updateTeam = createAsyncThunk(
    'team/updateTeam', async({team_id, updateData}) => {
        await axios.put(`http://localhost:3000/api/team/${team_id}`, updateData);
        return {team_id, updateData}
    }
);

//Slette team
export const deleteTeam = createAsyncThunk(
    'team/deleteTeam', async(team_id) => {
        await axios.delete(`http://localhost:3000/api/team/${team_id}`);
        return team_id;
    } 
);

//SLICE
