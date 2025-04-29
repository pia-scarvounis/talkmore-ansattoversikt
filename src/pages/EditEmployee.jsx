import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../redux/slices/employeeSlice";

import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import GreenButton from "../components/UI/GreenButton";
import RedButton from "../components/UI/RedButton";

import "../styles/form.css";
import defaultImage from "../assets/images/default-img.png";
import trashIcon from "../assets/icons/trash.svg";
import uploadIcon from "../assets/icons/img.svg";
import EditHistoryPopup from "../components/History/EditHistoryPopup"; // for å teste EditHistoryPopupen


const EditEmployee = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // hente id fra urlen
  const employeeId = parseInt(id, 10); // gjøre id om til tall

  const employeeList = useSelector((state) => state.employees.data); // henter employee-listen med data fra EmplyeeSlice. 

  // henter employees fra backend hvis listen er tom..
  useEffect(() => {
    if (!employeeList || employeeList.length === 0) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employeeList]);

  // finner riktig employee basert på ID
  const employee = employeeList?.find((emp) => emp.employee_id === employeeId);

  // hvis employee ikke finnes enda, vis melding
  if (!employee) {
    return <p>Laster inn, eller fant ikke ansatt...</p>;
  }

  return (
    <div className="form-page">
      <NavAdmin />
      <div className="form-content page-header-wrapper">
      <PageHeader title={`Rediger ansatt: ${employee?.employee_name || "ukjent ansatt"}`} />
   

        <div className="image-upload-container">
          <h2 className="section-heading">Endre bilde</h2> 
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

        {/* SECTION: TILGANGER */}
<div className="form-section">
  <h2 className="section-heading">Tilganger</h2>
  <div className="checkbox-group">
    <label>
      <input type="checkbox" name="access" value="Lisens 1" /> Eksempel Lisens 1
    </label>
    <label>
      <input type="checkbox" name="access" value="Lisens 2" /> Eksempel Lisens 2
    </label>
    <label>
      <input type="checkbox" name="access" value="Lisens 3" /> Eksempel Lisens 3
    </label>
    <label>
    <input type="checkbox" name="access" value="Lisens 4" /> Eksempel lisens 4 </label>
  </div>
</div>

        <div className="form-buttons">
          <GreenButton text="Lagre" onClick={() => console.log("Lagrer endringer")} />
          <RedButton text="Avbryt" onClick={() => console.log("Avbryter redigering")} />
        </div>

      </div>
    </div>
  );
};

export default EditEmployee;
