import React, { useState } from "react";
import GreenButton from "../UI/GreenButton";
import "../../styles/notes.css";

const AddNote = ({ onAdd }) => {
  const [newNote, setNewNote] = useState("");

  const handleAdd = () => {
    if (newNote.trim() !== "") {
      onAdd(newNote); // sender teksten til Notes.jsx
      setNewNote(""); // tømmer feltet
    }
  };

  return (
    <div className="add-note-column">
      <h3 className="add-note-title">Opprett notat for ansatt</h3>

      <textarea
        placeholder="Skriv nytt notat her..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        className="add-note-textarea"
      />

      <div className="note-actions">
        <GreenButton text="Lagre" onClick={handleAdd} />
      </div>
    </div>
  );
};

export default AddNote;
