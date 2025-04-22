// src/components/UI/Notes.jsx
import React, { useState } from "react";
import "../../styles/notes.css";
import editIcon from "../../assets/icons/edit.svg";
import trashIcon from "../../assets/icons/trash.svg";
import notesIcon from "../../assets/icons/notes.png";
import EditNotePopup from "./EditNotePopup";
import WhiteButton from "../UI/WhiteButton";
import GreenButton from "../UI/GreenButton";

const Notes = () => {
  const [notes, setNotes] = useState([
    { id: 1, text: "Hatt mange gode tilbakemeldinger fra kunder." },
    { id: 2, text: "Jobber foreløpig 80%, skal opp i 100% fra 1. juni." },
    { id: 3, text: "Kommer tilbake fra permisjon i september." }
  ]);

  const [noteToEdit, setNoteToEdit] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      const newNoteObj = { id: Date.now(), text: newNote };
      setNotes([newNoteObj, ...notes]);
      setNewNote("");
    }
  };

  const handleEdit = (note) => {
    setNoteToEdit(note);
  };

  const handleSave = (updatedText) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteToEdit.id ? { ...note, text: updatedText } : note
    );
    setNotes(updatedNotes);
    setNoteToEdit(null);
  };

  const handleDelete = (id) => {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
  };

  return (
    <div className="notes-wrapper">
      {/* VENSTRE SIDE – OPPRETT NOTAT */}
      <div className="add-note-column">
        <h3 className="add-note-title">Opprett notat for ansatt</h3>

        <textarea
          placeholder="Skriv nytt notat her..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="add-note-textarea"
        />

        <div className="note-actions">
          <GreenButton text="Lagre" onClick={handleAddNote} />
        </div>
      </div>

      {/* HØYRE SIDE – NOTATER */}
      <div className="notes-section">
        <h2 className="notes-title">
          <img src={notesIcon} alt="Notat-ikon" className="notes-icon" />
          Notater
        </h2>

        {notes.length === 0 ? (
          <p>Ingen notater enda.</p>
        ) : (
          (showAll ? notes : notes.slice(0, 2)).map((note) => (
            <div key={note.id} className="note-item">
              <p>{note.text}</p>
              <div className="note-icons">
                <img
                  src={editIcon}
                  alt="Rediger"
                  title="Rediger notat"
                  onClick={() => handleEdit(note)}
                />
                <img
                  src={trashIcon}
                  alt="Slett"
                  title="Slett notat"
                  onClick={() => handleDelete(note.id)}
                />
              </div>
            </div>
          ))
        )}

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






