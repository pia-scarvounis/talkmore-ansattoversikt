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
        const res = await axios.put(`http://localhost:3000/api/employees/note/${noteId}`, { note });
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

const noteSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [],
        loading: false,
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            //fetch loader
            .addCase(fetchNotesForEmployee.pending, (state) => {
                state.loading = true;
            })
            //fetch ferdig suksess
            .addCase(fetchNotesForEmployee.fulfilled, (state, action) => {
                state.loading = false;
                //henter state fra dispatch i komponent og sender den inn her som legger notater i arrayet notes: []
                state.notes = action.payload;
            })
            //fetch feilet
            .addCase(fetchNotesForEmployee.rejected,(state, action) => {
                //setter state loading til false da fetchen feilet
                state.loading = false;
                state.error = action.error.message;
            })
            //case for cruds på notater

            //Legg til notat
            .addCase(addNote.fulfilled, (state, action) => {
                //pusher det som blir sent inn her(action.payload) fra et komponent
                state.notes.push(action.payload);
            })
            //endre notat
            .addCase(editNote.fulfilled, (state, action) =>{
                const { noteId, note } = action.payload;
                const notes = state.notes.find(n => n.note_id === noteId);
                //hvis den finner note med id i notes [] lik som noteId som blir sendt inn i payload
                if(notes){
                    notes.note = note;
                }
            })
            //slette notat
            .addCase(deleteNote.fulfilled, (state, action) => {
                //henter id til notat sjekker id mot id som blir sendt inn her payload og sletter den
                state.notes = state.notes.filter(note => note.note_id !== action.payload);
            })
    }
});

export default noteSlice.reducer;