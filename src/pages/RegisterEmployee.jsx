import React, { useState, useEffect } from "react";

import NavAdmin from "../components/navigation/NavAdmin";
import AlertBox from "../components/UI/AlertBox";
import PageHeader from "../components/UI/PageHeader";

import GreenButton from "../components/UI/GreenButton";
import RedButton from "../components/UI/RedButton";
import WhiteButton from "../components/UI/WhiteButton";

import "../styles/form.css";
import defaultImage from "../assets/images/default-img.png";
import trashIcon from "../assets/icons/trash.svg";
import uploadIcon from "../assets/icons/img.svg";

const RegisterEmployee = () => {
  const [showSuccess, setShowSuccess] = useState(false);
const [showCancelConfirm, setShowCancelConfirm] = useState(false);

const handleSave = () => {
  setShowSuccess(true);
  setTimeout(() => {
    setShowSuccess(false);
  }, 3000);
};

const handleCancel = () => {
  setShowCancelConfirm(true);
};

const confirmCancel = () => {
  console.log("Avbrutt registrering");
  setShowCancelConfirm(false);
};

const cancelCancel = () => {
  setShowCancelConfirm(false);
};

  return (
    <div className="form-page">
      <NavAdmin />
      
      <div className="form-content page-header-wrapper">
    <PageHeader title="Registrer ansatt" />
  
    

          <div className="image-upload-container">
            <h2 className="section-heading">Last opp bilde</h2>
            <div className="image-box">
              <img
                src={defaultImage}
                alt="Profilbilde"
                className="profile-image"
              />
              <div className="icon-buttons">
                <img
                  src={uploadIcon}
                  alt="Last opp bilde"
                  className="icon-button"
                  title="Last opp bilde"
                />
                <img
                  src={trashIcon}
                  alt="Fjern bilde"
                  className="icon-button"
                  title="Fjern bilde"
                />
              </div>
            </div>
          </div>

        {/* SECTION: PERSONLIA */}
        <div className="form-section">
          <h2 className="section-heading">Personalia</h2>

          <div className="two-column">
            <div className="column">
              <label>Fornavn og Etternavn</label>
              <input type="text" />

              <label>Telefonnummer</label>
              <input type="text" />

              <label>Fødselsdato</label>
              <input type="date" />
            </div>

            <div className="column">
              <label>Epost (Talkmore)</label>
              <input type="email" />

              <label>Epost (Telenor)</label>
              <input type="email" />
            </div>
          </div>
        </div>

        {/* SECTION: PÅRØRENDE */}
        <div className="form-section">
          <h2 className="section-heading">Pårørende</h2>
          <div className="two-column">
            <div className="column">
              <label>Fornavn og Etternavn</label>
              <input type="text" />
            </div>
            <div className="column">
              <label>Telefonnummer</label>
              <input type="text" />
            </div>
          </div>
        </div>

        {/* SECTION: STILLINGSINFO */}
        <div className="form-section">
          <h2 className="section-heading">Stillingsinfo</h2>
          <div className="two-column">
            <div className="column">
              <label>Ansattnummer (Telenor)</label>
              <input type="text" />

              <label>Ansattnummer (Innleid)</label>
              <input type="text" />

              <label>Team</label>
              <select>
                <option>Velg</option>
              </select>

              <label>Stilling/rolle</label>
              <select>
                <option>Velg</option>
              </select>
            </div>

            <div className="column">
              <label>Fast / innleid</label>
              <select>
                <option>Velg</option>
              </select>

              <label>Stillingsprosent</label>
              <select>
                <option>Velg</option>
              </select>

              <label>Startdato</label>
              <input type="date" />

              <label>Sluttdato</label>
              <input type="date" />
            </div>
          </div>
        </div>

        {/* SECTION: TILGANGER */}
        <div className="form-section">
          <h2 className="section-heading">Tilganger</h2>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="access" value="Lisens 1" /> Eksempel
              Lisens 1
            </label>
            <label>
              <input type="checkbox" name="access" value="Lisens 2" /> Eksempel
              Lisens 2
            </label>
            <label>
              <input type="checkbox" name="access" value="Lisens 3" /> Eksempel
              Lisens 3
            </label>
            <label>
              <input type="checkbox" name="access" value="Lisens 4" /> Eksempel
              Lisens 4
            </label>
          </div>
        </div>

        <div className="form-buttons">
          <GreenButton
            text="Lagre"
            onClick={handleSave}
          />
          <RedButton
            text="Avbryt"
            onClick={handleCancel}
          />
        </div>
        {showSuccess && (
  <AlertBox type="success" title="Suksess!" message="Ansatt er lagret." />
)}

{showCancelConfirm && (
  <AlertBox
    type="confirmation"
    title="Avbryt registrering"
    message="Er du sikker på at du vil avbryte?"
  >
    <RedButton text="Ja, avbryt" onClick={confirmCancel} />
    <WhiteButton text="Fortsett" onClick={cancelCancel} />
  </AlertBox>
)}

        </div>
      </div>
   
  );
};

export default RegisterEmployee;
