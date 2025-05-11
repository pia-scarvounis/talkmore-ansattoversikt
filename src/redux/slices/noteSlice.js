import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// legge til api istedenfor axios. når det er klart
// api inneholder header og token 
import api from '../../backend/apiToken/axiosInstance.js';

//Backend ruterene for NOTE liggere i users_routes.js
//fetch hente notat for ansatt med employeeId
export const fetchNotesForEmployee = createAsyncThunk(
  "note/fetchNotesForEmployee",
  async (employeeId) => {
    //henter ruteren vår fra backend localhost:3000
    const res = await api.get(`http://localhost:3000/api/note/${employeeId}`);
    console.log("Notater fra backend:", res.data);
    return res.data;
  }
);
//fetch legg til notat for en ansatt
export const addNote = createAsyncThunk(
  "note/addNote",
  async ({ employee_id, note }) => {
    console.log("Sender til backend:", { employee_id, note });

    const res = await api.post(`http://localhost:3000/api/note`, {
      employee_id,
      note,
    });
    return res.data;
  }
);

//fetch endre notat til ansatt med n
export const editNote = createAsyncThunk(
  "note/editNote",
  async ({ noteId, note }) => {
    const res = await api.put(`http://localhost:3000/api/note/${noteId}`, {
      note,
    });
    return { noteId, note };
  }
);

//fetch slette notat til ansatt
export const deleteNote = createAsyncThunk("note/delete", async (noteId) => {
  const res = await api.delete(`http://localhost:3000/api/note/${noteId}`);
  return noteId;
});

//note SLICE og start STATE

const noteSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch loader
      .addCase(fetchNotesForEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //fetch ferdig suksess
      .addCase(fetchNotesForEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;

        //henter state fra dispatch i komponent og sender den inn her som legger notater i arrayet notes: []
        state.notes = action.payload;
      })
      //fetch feilet
      .addCase(fetchNotesForEmployee.rejected, (state, action) => {
        //setter state loading til false da fetchen feilet
        state.loading = false;
        state.error = action.error.message;
      })

      //case for cruds på notater

      //Legg til notat
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload.newNote); //Bruker unshift for å legge det først
      })

      //endre notat
      .addCase(editNote.fulfilled, (state, action) => {
        const { noteId, note } = action.payload;
        const existingNote = state.notes.find(
          (n) => n.note_id === parseInt(noteId)
        );
        if (existingNote) {
          existingNote.note = note; // Oppdaterer teksten
          existingNote.last_modified = new Date().toISOString(); // Simulerer tidsstempel
        }
      })
      //slette notat
      .addCase(deleteNote.fulfilled, (state, action) => {
        //henter id til notat sjekker id mot id som blir sendt inn her payload og sletter den
        state.notes = state.notes.filter(
          (note) => note.note_id !== action.payload
        );
      });
  },
});

export default noteSlice.reducer;
