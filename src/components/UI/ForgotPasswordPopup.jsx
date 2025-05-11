import React, { useState } from "react";
import GreenButton from "./GreenButton";
import RedButton from "./RedButton";
import "../../styles/popup.css"; 
import "../../styles/login.css"; 

const ForgotPasswordPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = () => {
    if (!email || !email.includes("@")) {
      setError("Vennligst skriv inn en gyldig e-postadresse.");
      setSuccessMessage("");
      return;
    }

    setError("");
    setSuccessMessage(
      "Dersom e-postadressen finnes i systemet, har du nå fått en lenke for å tilbakestille passordet"
    );
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box popup-box-large" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">Glemt passord</h2>

        <p className="popup-text">
          {successMessage ||
            error ||
            "Skriv inn din registrerte e-postadresse, så sender vi deg en tilbakestillingslenke"}
        </p>

        {!successMessage && (
          <>
            <input
              type="email"
              placeholder="E-postadresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="forgot-popup-input"
            />

            <div className="popup-buttons">
              <GreenButton text="Send" onClick={handleSubmit} />
              <RedButton text="Lukk" onClick={onClose} />
            </div>
          </>
        )}

        {successMessage && (
          <div className="popup-buttons">
            <RedButton text="Lukk" onClick={onClose} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;







