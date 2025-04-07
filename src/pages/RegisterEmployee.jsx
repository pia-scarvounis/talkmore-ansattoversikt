import React from "react";
import NavAdmin from "../components/navigation/NavAdmin";
import "../styles/global.css";
import "../styles/register.css";
import defaultImage from "../assets/images/default-img.png";
import trashIcon from "../assets/icons/trash.svg";
import uploadIcon from "../assets/icons/img.svg";



const RegisterEmployee = () => {
  return (
    <div className="register-page">
      <NavAdmin />

      <div className="register-content">
        <h1>Registrer ansatt</h1>
        <div className="image-upload-container">
        <h2 className="section-heading">Last opp bilde</h2> 
    <div className="image-box">
      <img src={defaultImage} alt="Profilbilde" className="profile-image" />
      <div className="icon-buttons">
        <img src={uploadIcon} alt="Last opp bilde" className="icon-button" title="Last opp bilde" />
        <img src={trashIcon} alt="Fjern bilde" className="icon-button" title="Fjern bilde" />
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

              <label>Avdeling</label>
              <select><option>Velg</option></select>

              <label>Team</label>
              <select><option>Velg</option></select>

              <label>Stilling/rolle</label>
              <select><option>Velg</option></select>
            </div>

            <div className="column">
              <label>Fast / innleid</label>
              <select><option>Velg</option></select>

              <label>Stillingsprosent</label>
              <select><option>Velg</option></select>

              <label>Startdato</label>
              <input type="date" />

              <label>Sluttdato</label>
              <input type="date" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployee;


