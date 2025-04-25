import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotesForEmployee,
  addNote,
  editNote,
  deleteNote,
} from "../../redux/slices/noteSlice";
import AddNote from "../Employee/AddNote";
import "../../styles/notes.css";
import editIcon from "../../assets/icons/edit.svg";
import trashIcon from "../../assets/icons/trash.svg";
import notesIcon from "../../assets/icons/notes.png";
import EditNotePopup from "./EditNotePopup";
import WhiteButton from "../UI/WhiteButton";
import GreenButton from "../UI/GreenButton";

const Notes = ({ employeeId }) => {
  const dispatch = useDispatch();

  // henter state fra redux-storen
  const { notes, loading, error } = useSelector((state) => state.notes);

  const [noteToEdit, setNoteToEdit] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [newNote, setNewNote] = useState("");

  //  henter notater automatisk når komponenten laster
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchNotesForEmployee(employeeId));
    }
  }, [dispatch, employeeId]);

  // Opprett nytt notat
  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      dispatch(addNote({ employee_id: employeeId, note: newNote }));
      setNewNote(""); // Nullstill feltet
    }
  };

  // rediger notat

  const handleSave = (updatedText) => {
    dispatch(editNote({ noteId: noteToEdit.note_id, note: updatedText }));
    setNoteToEdit(null);
  };

  // slett notat

  const handleDelete = (id) => {
    dispatch(deleteNote(id));
  };

  return (
    <div className="notes-wrapper">
      {/* VENSTRE SIDE – OPPRETT NOTAT */}
      <AddNote onAdd={handleAddNote} />

      {/* HØYRE SIDE – NOTATER */}
      <div className="notes-section">
        <h2 className="notes-title">
          <img src={notesIcon} alt="Notat-ikon" className="notes-icon" />
          Notater
        </h2>
        {/* FEIL ELLER LASTING */}
        {loading && <p>Laster notater...</p>}
        {error && <p className="error">{error}</p>}
        {notes.length === 0 && !loading && <p>Ingen notater enda.</p>}

        {/* VIS NOTATER (maks 2 hvis ikke showAll er aktiv) */}
        {(showAll ? notes : notes.slice(0, 2)).map((note) => (
          <div key={note.note_id} className="note-item">
            <p>{note.note}</p>
            <div className="note-icons">
              <img
                src={editIcon}
                alt="Rediger"
                title="Rediger notat"
                onClick={() => setNoteToEdit(note)}
              />
              <img
                src={trashIcon}
                alt="Slett"
                title="Slett notat"
                onClick={() => handleDelete(note.note_id)}
              />
            </div>
          </div>
        ))}

        {/* KNAPP FOR Å LASTE INN FLERE */}
        {notes.length > 2 && (
          <div className="note-actions">
            <WhiteButton
              text={showAll ? "Vis færre" : "Last flere"}
              onClick={() => setShowAll(!showAll)}
            />
          </div>
        )}
      </div>

      {noteToEdit && (
        <EditNotePopup
          note={noteToEdit}
          onSave={handleSave}
          onClose={() => setNoteToEdit(null)}
        />
      )}
    </div>
  );
};

export default Notes;
