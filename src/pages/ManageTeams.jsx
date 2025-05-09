import React, { useState } from "react";
import { useSelector } from "react-redux";
import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import GreenButton from "../components/UI/GreenButton";
import RedButton from "../components/UI/RedButton";
import WhiteButton from "../components/UI/WhiteButton";
import AlertBox from "../components/UI/AlertBox";

import "../styles/form.css";
import "../styles/buttons.css";

const ManageTeams = () => {
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [saveType, setSaveType] = useState("");
  const { departments, teams } = useSelector((state) => state.metaData); // henter inn dataene vi allerede har lagret i Redux fra metaDataSlice: altså avd og teamene som vises i navigasjonen!

  const [selectedDepartment, setSelectedDepartment] = useState("");
const [selectedTeam, setSelectedTeam] = useState("");
const [newTeamName, setNewTeamName] = useState(""); // disse for å hente ut avd + teams fra dropdown




  const handleSave = (type) => {
    setSaveType(type);
    setShowSaveAlert(true);
  };
  const handleDelete = () => setShowDeleteAlert(true);

  const confirmSave = () => {
    setShowSaveAlert(false);
    console.log("Lagrer data...");
  };

  const confirmDelete = () => {
    setShowDeleteAlert(false);
    console.log("Sletter team...");
  };

  return (
    <div className="form-page">
      <NavAdmin />

      <div className="form-content page-header-wrapper">
        <PageHeader title="Administer Team" />
        {/* Endre Teamnavn  */}
        <div className="form-section team-box">
          <h2 className="section-heading">Endre Teamnavn</h2>

          <div className="two-column">
            <div className="column">
              <label>Velg Avdeling</label>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                <option value="">Velg avdeling</option>
                {departments.map((dep) => (
      <option key={dep.department_id} value={dep.department_id}>
        {dep.department_name}
      </option>
    ))}
              </select>
            </div>
            <div className="column">
              <label>Velg team som skal endres</label>
              <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                <option value="">Velg team</option>
                {teams
      .filter((team) => team.team_department_id === Number(selectedDepartment))
      .map((team) => (
        <option key={team.team_id} value={team.team_id}>
          {team.team_name}
        </option>
      ))}
              </select>
            </div>
            <div className="column">
              <label>Skriv inn nytt navn for dette teamet</label>
              <input type="text" value={newTeamName}
    onChange={(e) => setNewTeamName(e.target.value)}
   />
            </div>
          </div>
          <div className="manage-teams-buttons">
            <GreenButton text="Lagre" onClick={() => handleSave("lagre")} />{" "}
          </div>
        </div>

        {/* Opprett nytt Team */}
        <div className="form-section team-box">
          <h2 className="section-heading">Opprett nytt Team</h2>

          <div className="two-column">
            <div className="column">
              <label>Velg Avdeling</label>
              <select>
                <option>Bedrift</option>
              </select>
            </div>
            <div className="column">
              <label>Skriv inn Teamnavn</label>
              <input type="text" />
            </div>
          </div>

          <div className="manage-teams-buttons">
            <GreenButton
              text="Legg til"
              onClick={() => handleSave("leggtil")}
            />{" "}
          </div>
        </div>

        {/* Slett Team  */}
        <div className="form-section team-box">
          <h2 className="section-heading">Slett Team</h2>

          <div className="two-column">
            <div className="column">
              <label>Velg Avdeling</label>
              <select>
                <option>Privat</option>
              </select>
            </div>
            <div className="column">
              <label>Velg Team som skal slettes</label>
              <select>
                <option>Havana</option>
              </select>
            </div>
          </div>

          <div className="manage-teams-buttons">
            <RedButton text="Slett" onClick={handleDelete} />
          </div>
        </div>

        {/*  ALERTS  */}
        {showSaveAlert && (
          <AlertBox
            type="confirmation"
            title={
              saveType === "lagre" ? "Bekreft lagring" : "Bekreft opprettelse"
            }
            message={
              saveType === "lagre"
                ? "Er du sikker på at du ønsker å lagre dette?"
                : "Er du sikker på at du ønsker å legge til dette?"
            }
          >
            <WhiteButton text="Fortsett" onClick={confirmSave} />
            <RedButton text="Avbryt" onClick={() => setShowSaveAlert(false)} />
          </AlertBox>
        )}

        {showDeleteAlert && (
          <AlertBox
            type="confirmation"
            title="Bekreft sletting"
            message="Er du sikker på at du ønsker å slette dette?"
          >
            <WhiteButton text="Fortsett" onClick={confirmDelete} />
            <RedButton
              text="Avbryt"
              onClick={() => setShowDeleteAlert(false)}
            />
          </AlertBox>
        )}
      </div>
    </div>
  );
};

export default ManageTeams;
