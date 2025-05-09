import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // sender handlinger til Redux. useSelector: henter data fra Redux-storen

import { fetchMetaData } from "../redux/slices/metaDataCrudsSlice"; // henter avdelinger og teams fra backend
import { updateTeam, createTeam, deleteTeam } from "../redux/slices/AdminSlices/adminTeamCruds"; // gir oss tilgang til updateTeam og createTeam-funksjonene vi har laget i Redux


import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import GreenButton from "../components/UI/GreenButton";
import RedButton from "../components/UI/RedButton";
import WhiteButton from "../components/UI/WhiteButton";
import AlertBox from "../components/UI/AlertBox";

import "../styles/form.css";
import "../styles/buttons.css";

const ManageTeams = () => {
  const dispatch = useDispatch();
  const { departments, teams } = useSelector((state) => state.metaData); // henter inn dataene vi allerede har lagret i Redux fra metaDataSlice: altså avd og teamene som vises i navigasjonen!

  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [saveType, setSaveType] = useState("");
  

  useEffect(() => {
    dispatch(fetchMetaData()); // henter data fra backend når komponenten lastes inn (engangsbruk fordi dependency-array er [dispatch])
  }, [dispatch]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [newTeamName, setNewTeamName] = useState(""); // disse for å hente ut avd + teams fra dropdown 

  // disse brukes når admin skal opprette nytt team:
  // (brukes senere når vi sender data til databasen via Redux)
const [newTeamDepartment, setNewTeamDepartment] = useState(""); // avdeling ID
const [newTeamNameCreate, setNewTeamNameCreate] = useState(""); // navnet på nytt team
// disse brukes når admin skal slette et team
const [deleteTeamDepartment, setDeleteTeamDepartment] = useState("");
const [deleteTeamId, setDeleteTeamId] = useState("");



  const handleSave = (type) => {
    setSaveType(type);
    setShowSaveAlert(true);
  };
  const handleDelete = () => setShowDeleteAlert(true);

  const confirmSave = () => {
    setShowSaveAlert(false);
    if (saveType === "lagre") {
      if (!selectedTeam || !newTeamName) {
        alert("Du må velge team og skrive inn nytt navn.");
        return;
      }

      // Lager objektet som skal sendes til backend
      const updateData = {
        team_name: newTeamName,
        department_id: Number(selectedDepartment),
      };

      // Sender til Redux
      dispatch(updateTeam({ team_id: selectedTeam, updateData }))
        .unwrap() // gjør at vi kan bruke try/catch eller .then/.catch uten nested dispatch
        .then(() => {
          // Etter oppdatering hentes ny data
          dispatch(fetchMetaData());
          alert("Teamnavn oppdatert!");
          setNewTeamName("");
          window.location.href = "/admin-dashboard"; // tvinger siden til å oppdatere navigasjonen
        })
        .catch((error) => {
          console.error("Feil ved oppdatering:", error);
          alert("Det oppstod en feil ved lagring.");
        });
    }
    if (saveType === "leggtil") {
      if (!newTeamNameCreate || !newTeamDepartment) {
        alert("Du må velge avdeling og skrive inn teamnavn.");
        return;
      }
  
      const newTeam = {
        team_name: newTeamNameCreate,
        department_id: Number(newTeamDepartment),
      };
  
      dispatch(createTeam(newTeam))
        .unwrap()
        .then(() => {
          dispatch(fetchMetaData());
          alert("Nytt team er opprettet!");
          setNewTeamNameCreate("");
          setNewTeamDepartment("");
          window.location.href = "/admin-dashboard";
        })
        .catch((error) => {
          console.error("Feil ved oppretting:", error);
          alert("Det oppstod en feil ved opprettelse.");
        });
    }
  };

  const confirmDelete = () => {
    setShowDeleteAlert(false);
    if (!deleteTeamId) {
      alert("Du må velge et team å slette.");
      return;
    }
  
    dispatch(deleteTeam(deleteTeamId))
      .unwrap()
      .then(() => {
        dispatch(fetchMetaData()); // henter oppdatert liste
        alert("Team er slettet!");
        setDeleteTeamId("");
        setDeleteTeamDepartment("");
        window.location.href = "/admin-dashboard"; // tvinger navigasjonen til å oppdatere
      })
      .catch((error) => {
        console.error("Feil ved sletting:", error);
        alert("Det oppstod en feil ved sletting.");
      });
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
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
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
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">Velg team</option>
                {teams
                  .filter(
                    (team) =>
                      team.team_department_id === Number(selectedDepartment)
                  )
                  .map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="column">
              <label>Skriv inn nytt navn for dette teamet</label>
              <input
                type="text"
                value={newTeamName}
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
              <select value={newTeamDepartment}
        onChange={(e) => setNewTeamDepartment(e.target.value)}>
                <option>Velg avdeling</option>
                {departments.map((dep) => (
    <option key={dep.department_id} value={dep.department_id}>
      {dep.department_name}
    </option>
  ))}
              </select>
            </div>
            <div className="column">
              <label>Skriv inn Teamnavn</label>
              <input type="text" value={newTeamNameCreate}
  onChange={(e) => setNewTeamNameCreate(e.target.value)}/>
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
              <select value={deleteTeamDepartment}
  onChange={(e) => setDeleteTeamDepartment(e.target.value)}>
                <option value="">Velg avdeling</option>
                {departments.map((dep) => (
    <option key={dep.department_id} value={dep.department_id}>
      {dep.department_name}
    </option>
  ))}
              </select>
            </div>
            <div className="column">
              <label>Velg Team som skal slettes</label>
              <select value={deleteTeamId}
  onChange={(e) => setDeleteTeamId(e.target.value)}>
                <option value="">Velg team</option>
                {teams
    .filter((team) => team.team_department_id === Number(deleteTeamDepartment))
    .map((team) => (
      <option key={team.team_id} value={team.team_id}>
        {team.team_name}
      </option>
    ))}
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
