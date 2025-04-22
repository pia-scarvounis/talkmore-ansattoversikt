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
    <div className="add-note">
     <h2 className="notes-title">Opprett notat for ansatt</h2>


      <textarea
        placeholder="Skriv nytt notat her..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        className="add-note-textarea"
      />

      <div className="add-note-button">
        <GreenButton text="Lagre" onClick={handleAdd} />
      </div>
    </div>
  );
};

export default AddNote;
