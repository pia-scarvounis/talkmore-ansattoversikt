import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//Backend ruterene for NOTE liggere i users_routes.js 
//fetch hente notat for ansatt med employeeId
export const fetchNotesForEmployee = createAsyncThunk(
    'note/fetchNoteForEmployee',
    async (employeeId) => {
        //henter ruteren vår fra backend localhost:3000
        const res = await axios.get(`http://localhost:3000/api/employees/note/${employeeId}`);
        return res.data;
    }
);
//fetch legg til notat for en ansatt 
export const addNote = createAsyncThunk(
    'note/addNote',
    async({employee_id, note}) => {
        const res = await axios.post(`http://localhost:3000/api/employees/note`,{employee_id, note});
        return res.data;
    }
)
//fetch endre notat til ansatt med n
export const editNote = createAsyncThunk(
    'note/editNote',
    async (noteId, note) => {
        const res = await axios.put(`http://localhost:3000/api/employees/note/${noteId}`);
        return res.data;
    }
)
//fetch slette notat til ansatt 
export const deleteNote = createAsyncThunk(
    'note/delete',
    async (noteId) => {
        const res = await axios.delete(`http://localhost:3000/api/employees/${noteId}`);
        return noteId;
    }
);

//note SLICE og start STATE

