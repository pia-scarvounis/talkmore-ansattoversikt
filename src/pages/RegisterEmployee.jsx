import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

//fra createEmployeeSlice
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, resetCreateEmployeeState } from "../redux/slices/AdminSlices/adminEmplCreate_CrudSlice";
//hente metadata get avd, team, stillinger og lisenser
import { fetchMetaData } from "../redux/slices/metaDataCrudsSlice";

const RegisterEmployee = () => {


  const dispatch = useDispatch();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();

  const [filteredTeams, setfilteredTeams] = useState([]);
  const {success, loading, error} = useSelector((state) => state.createEmployee);
  
 
  useEffect(()=> {
    dispatch(fetchMetaData());
  },[dispatch]);

  //Henter ut getMetadat departments, teams, posistions og lisenser
  const { departments, teams, posistions, licenses } = useSelector((state) => state.metaData);

  //Form data som skal bli sendt inn i create employee
  const [formData, setFormData] = useState({
    employee_name: '',
    phoneNr: '',
    epost: '',
    epost_Telenor: '',
    birthdate: '',
    start_date: '',
    end_date: '',
    form_of_employeement: '',
    employeeNr_Talkmore: '',
    employeeNr_Telenor: '',
    employee_percentages: '',
    department_id: '',
    team_id: '',
    workPosistion_id: '',
    licenses: [],
    relative: []
    //ikke satt permisjon her da det ikke skal være med i opprettelse av ansatt kun endring på ansatt
  })

  //filtrer team basert på valgt avdeling
  useEffect(() => {
    if (formData?.department_id && teams.length > 0) {
      const filtered = teams.filter(
        (t) => t.team_department_id?.toString() === formData.department_id
      );
      setfilteredTeams(filtered);
      console.log("Filtered teams:", filtered);
    }
  }, [formData?.department_id, teams]);
      
  
  //håndtering av input endringer string og Number type -gpt
  const handleInputChange = (e) => {
    const {name, value, type } = e.target;

    const cleanedValue =
    name === "phoneNr" || name === "relative_phoneNr"
    ? value.replace(/[^\d+]/g, "")
    : value;


    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue
    }));
  }

  //lisenshåndtering huket av lisenser med type håndtering nr og string
  const handleLicenseChange = (e) => {
    const {value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
      ? [...prev.licenses, {license_id: Number(value)}]
      : prev.licenses.filter((l) => l.license_id !== Number(value));
      return {...prev, licenses: updated};
    });
  }

  //lagre
  const handleSave =  async() => {
    try{
      await dispatch(createEmployee(formData)).unwrap();
      dispatch(resetCreateEmployeeState());

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/admin-dashboard`);
      }, 3000);
    }catch(err){
      console.error('Feil ved oppretting');
    }
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    navigate("/admin-dashboard/admin-panel");
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
              <input 
              type="text" 
              name="employee_name"
              value={formData.employee_name}
              onChange={handleInputChange}
              />

              <label>Telefonnummer</label>
              <input 
              type="tel"
              name="phoneNr"
              pattern="[+0-9]*"
              value={formData.phoneNr}
              onChange={handleInputChange} 

              />

              <label>Fødselsdato</label>
              <input 
              type="date" 
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
              />
            </div>

            <div className="column">
              <label>Epost (Talkmore)</label>
              <input 
              type="email" 
              name="epost"
              value={formData.epost}
              onChange={handleInputChange}
              />

              <label>Epost (Telenor)</label>
              <input 
              type="email"
              name="epost_Telenor"
              value={formData.epost_Telenor}
              onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* SECTION: PÅRØRENDE */}
        <div className="form-section">
          <h2 className="section-heading">Pårørende</h2>
          <div className="two-column">
            <div className="column">
              <label>Fornavn og Etternavn</label>
              <input 
              type="text" 
              name="relative_name"
              value={formData.relative[0]?.relative_name || ""}
              onChange={(e) => {
                const updated = {
                  relative_name: e.target.value,
                  relative_phoneNr: formData.relative[0]?.relative_phoneNr || ""
                };
                setFormData((prev) => ({...prev, relative: [updated]}));
              }} 
              />
            </div>
            <div className="column">
              <label>Telefonnummer</label>
              <input 
              type="tel"
              name="relative_phoneNr"
              value={formData.relative[0]?.relative_phoneNr || ""} 
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\d+]/g, "");
                const updated = {
                  relative_name: formData.relative[0]?.relative_name || "",
                  relative_phoneNr: cleaned
                };
                //setter inn i formdata
                setFormData((prev) => ({...prev, relative: [updated]}));
              }}
              
              />
            </div>
          </div>
        </div>

        {/* SECTION: STILLINGSINFO */}
        <div className="form-section">
          <h2 className="section-heading">Stillingsinfo</h2>
          <div className="two-column">
            <div className="column">
              <label>Ansattnummer (Talkmore)</label>
              <input 
                type="number" 
                name="employeeNr_Talkmore"
                value={formData.employeeNr_Talkmore}
                onChange={handleInputChange}
              />

              <label>Ansattnummer (Telenor)</label>
              <input 
                type="number" 
                name="employeeNr_Telenor"
                value={formData.employeeNr_Telenor}
                onChange={handleInputChange}
              />

              <label>Avdeling</label>
              <select 
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
              >
                <option value="">Velg</option>
                {departments.map(dep => (
                  <option key={dep.department_id} value={dep.department_id}>
                    {dep.department_name}
                  </option>
                ))}
              </select>

              <label>Team</label>
              <select 
                name="team_id"
                value={formData.team_id}
                onChange={handleInputChange}
              >
                <option value="">Velg</option>
                {filteredTeams.map(team => (
                  <option key={team.team_id} value={team.team_id.toString()}>
                    {team.team_name}
                  </option>
                ))}
              </select>

              <label>Stilling</label>
              <select 
                name="workPosistion_id" 
                value={formData.workPosistion_id}
                onChange={handleInputChange}
                >
                <option>Velg</option>
                {posistions.map(pos => (
                  <option key={pos.workPosistion_id} value={pos.workPosistion_id}>
                    {pos.posistion_title}
                  </option>
                ))}
              </select>
            </div>

            <div className="column">
              <label>Fast / innleid</label>
              <select 
                name="form_of_employeement"
                value={formData.form_of_employeement}
                onChange={handleInputChange}
                >
                <option value="">Velg</option>
                <option value="Fast">Fast</option>
                <option value="Innleid">Innleid</option>
              </select>

              <label>Stillingsprosent</label>
              <select
                name="employee_percentages"
                value={formData.employee_percentages}
                onChange={handleInputChange}
              >
                <option value="">Velg</option>
                {[...Array(10)].map((_, i) => {
                  const pct = (i + 1) * 10;
                  return (
                    <option key={pct} value={pct}>
                      {pct}%
                    </option>
                  )
                })}
              </select>

              <label>Startdato</label>
              <input 
                type="date" 
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
              />

              <label>Sluttdato</label>
              <input 
                type="date" 
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* SECTION: TILGANGER */}
        <div className="form-section">
          <h2 className="section-heading">Tilganger</h2>
          <div className="checkbox-group">
            {licenses.map(license => (
               <label key={license.license_id}>
                <input 
                  type="checkbox" 
                  value={license.license_id}
                  checked={formData.licenses.some(
                    (l) => l.license_id === license.license_id)}
                  onChange={handleLicenseChange}
                  /> 
               {license.license_title}
             </label>
            ))}
          </div>
        </div>

        <div className="form-buttons">
          <GreenButton text="Lagre" onClick={handleSave} />
          <RedButton text="Avbryt" onClick={handleCancel} />
        </div>
        {showSuccess && (
          <AlertBox
            type="success"
            title="Suksess!"
            message="Ansatt er lagret."
          />
        )}

        {showCancelConfirm && (
          <AlertBox
            type="confirmation"
            title="Avbryt registrering"
            message="Er du sikker på at du vil avbryte?"
          >
            <RedButton text="Ja, avbryt" onClick={confirmCancel}  />
            <WhiteButton text="Nei" onClick={cancelCancel} />
          </AlertBox>
        )}
      </div>
    </div>
  );
};

export default RegisterEmployee;
