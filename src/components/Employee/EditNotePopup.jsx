import React, { useState, useEffect } from "react";
import RedButton from "../UI/RedButton";
import GreenButton from "../UI/GreenButton";
import "../../styles/popup.css";

const EditNotePopup = ({ note, onClose, onSave }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (note) {
      setText(note.text);
    }
  }, [note]);

  const handleSaveClick = () => {
    if (onSave && typeof onSave === "function") {
      onSave(text); //  sender ny tekst til Notes.jsx
    }
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">Rediger notat</h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ width: "100%" }}
        />

        <div className="popup-buttons">
          <GreenButton text="Lagre" onClick={handleSaveClick} />
          <RedButton text="Avbryt" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default EditNotePopup;


