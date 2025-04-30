import React, {useState, useEffect, Suspense} from "react";
import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import GreenButton from "../components/UI/GreenButton";
import RedButton from "../components/UI/RedButton";

import "../styles/form.css";
import defaultImage from "../assets/images/default-img.png";
import trashIcon from "../assets/icons/trash.svg";
import uploadIcon from "../assets/icons/img.svg";
import EditHistoryPopup from "../components/History/EditHistoryPopup"; // for å teste EditHistoryPopupen

import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateEmployee, resetUpdateState } from "../redux/slices/adminCrudsSlice";
import { fetchEmployees } from "../redux/slices/employeeSlice";
import { fetchMetaData } from "../redux/slices/metaDataCrudsSlice";

const EditEmployee = () => {

  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  if (!id) return <div>Mangler ID</div>;

  //henter den ansatte fra get employeeSlicen og finner ansatte med id lik url
  const employee = useSelector(state => {
    if (!id || !state.employees?.data) return null;
    return state.employees.data.find(emp => emp.employee_id === Number(id));
  });

  useEffect(() => {
    dispatch(fetchMetaData());
  }, [dispatch]);
  

  //Uthenting av avdeling/Teams/stillinger
  const {departments, teams, posistions } = useSelector(state => state.metaData);
  //alle lisenser
  const {licenses: allLicenses } = useSelector(state => state.metaData);
  //Henter fra updateEmployeeSlicen
  const {loading, success, error} = useSelector(state => state.updateEmployee);
  
   //vi må bruke formdata
  const [formData, setFormData] = useState(null)
  const [filteredTeams, setfilteredTeams] = useState([]);
  

  useEffect(() => {
    if (!employee) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employee]);

  useEffect(() => {
    dispatch(fetchMetaData());
  }, [dispatch]);
  
  //Etter henting av ansatt så setter vi inn data
  //Det må hentes på denne måten og ikke oppdatere i selve endre ansatt Slicen da backend ikke returnerer
  //listen, og versions id fra api genesys kan endre seg og settes inn i oppdatert ansatt
  
  //Setter data og lar eksisterene data være i feltene
  useEffect(() => {
    if(employee ) {
      
      const deptId = employee.department_id ? String(employee.department_id): '';
      const teamId = employee.team_id ? String(employee.team_id): '';

      const filtered = teams.filter((t) => t.department_id?.toString() === deptId);
      setfilteredTeams(filtered);

      console.log("employee.department_id:", employee.department_id);
      console.log("employee.team_id:", employee.team_id);


      setFormData({
        employee_name: employee.employee_name || '',
        epost: employee.epost || '',
        epost_Telenor: employee.epost_Telenor || '',
        phoneNr: employee.phoneNr || '',
        birthdate: employee.birthdate ? employee.birthdate.split('T')[0] : '',
        start_date: employee.start_date  ? employee.start_date.split('T')[0] : '',
        end_date: employee.end_date ? employee.end_date.split('T')[0] : '',
        form_of_employeement:employee.form_of_employeement || '',
        employeeNr_Talkmore: employee.employeeNr_Talkmore || '',
        employeeNr_Telenor: employee.employeeNr_Telenor || '',
        employee_percentages: employee.employee_percentages || '',
        department_id: deptId,
        team_id: teamId ,
        workPosistion_id: employee.workPosistion_id || '',
        licenses:employee.licenses || [],
        relative: employee.relative || [],
        leave: employee.leave || null,
      
      });
        
    }
  }, [employee]);

  useEffect(() => {
    if (formData?.department_id && teams.length > 0) {
      const filtered = teams.filter(
        (t) => t.department_id?.toString() === formData.department_id
      );
      setfilteredTeams(filtered);
    }
  }, [formData?.department_id, teams]);


  //oppdaterer formData (objektet ansatt info) med input
  const handleChange = (e) => {
   const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  //Når bruker endrer avdeling i options
  const handleDepartmentChange = (e) => {

    const departmentId = e.target.value;

    setFormData(prev => ({
      ...prev,
      department_id: departmentId,
      team_id: ''
    }));
    const filtered = teams.filter(t => t.department_id?.toString() === departmentId);
    setfilteredTeams(filtered);
  }

  console.log("department_id:", formData?.department_id);
  console.log("filteredTeams:", filteredTeams);
  console.log("selected option:", departments.find(dep => dep.department_id.toString() === formData?.department_id));
  

  //lagre
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData) return;
    //sender inn oppdatert ansatt objektet som formData i fetchen
    dispatch(updateEmployee({id, updatedData: formData }));
  }

  //etter vellykket oppdatering
  useEffect(() =>{
    if(success){
      dispatch(fetchEmployees());
      //resetter oppdateringg
      dispatch(resetUpdateState());
      //Sette riktig alert ui her!!!!
      alert('Ansatt oppdatert');
      //sett inn riktig navigasjon her: tilbake til ansattprofildetaljer med id)
      navigate(`/employee/${id}`);
    }
    if(error){
      alert('Feil: ' + error);
      dispatch(resetUpdateState());
    }
  },[success, error, dispatch, navigate]);

  if(!formData){
    return <div>Laster ansatt...</div>
  }

  return (
    <div className="form-page">
      <NavAdmin />
      <div className="form-content page-header-wrapper">
      <PageHeader title="Rediger ansatt" />
    
    <form onSubmit={handleSubmit}>
    {/* SECTION: IMAGE */}
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
              <input type="text" name='employee_name' value={formData.employee_name} onChange={handleChange}/>
              
              <label>Telefonnummer</label>
              <input type="text" name="phoneNr" value={formData.phoneNr} onChange={handleChange} />

              <label>Fødselsdato</label>
              <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            </div>

            <div className="column">
              <label>Epost (Talkmore)</label>
              <input type="email"  name="epost" value={formData.epost} onChange={handleChange}/>

              <label>Epost (Telenor)</label>
              <input type="email" name="epost_Telenor" value={formData.epost_Telenor} onChange={handleChange}/>
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
              <input type="text" name="relative_name" 
              value={formData.relative.length > 0 ? formData.relative[0].relative_name : ''} 
              onChange={(e) => {
                const newRelatives = [...formData.relative];
                  if(newRelatives.length > 0){
                    newRelatives[0].relative_name = e.target.value;
                  }
                  setFormData(prev =>({...prev, relative: newRelatives}));
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
              <input type="number" name="employeeNr_Talkmore" value={formData.employeeNr_Talkmore}
              onChange={handleChange}/>

              <label>Ansattnummer (Telenor)</label>
              <input type="number" name="employeeNr_Telenor" value={formData.employeeNr_Telenor}
              onChange={handleChange}/>

              {/**MÅ HENTE INN rutere for å hente team og stillinger fra databasen */}
              {/**Avdeling og team */}
              <label>Avdeling</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleDepartmentChange}
              >
                <option value="">Velg avdeling</option>
                {departments.map(dep => (
                  <option 
                    key={dep.department_id}
                    value={dep.department_id.toString()}
                    >
                      {dep.department_name}
                  </option>
                ))}
              </select>

              <label>Team</label>
              <select
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
              disabled={!formData.department_id}
              >
                <option value=''>Velg</option>
                {filteredTeams.map(team => (
                  <option key={team.team_id} value={team.team_id.toString()}>
                    {team.team_name}
                  </option>
                ))}
              </select>

              <label>Stillingstittel</label>
              <select
              name="workPosistion_id"
              value={formData.workPosistion_id}
              onChange={handleChange}
              >
              <option value=''>Velg stilling</option>
              {posistions.map(posistion =>(
                <option key={posistion.workPosistion_id} value={posistion.workPosistion_id}>
                  {posistion.posistion_title}
                </option>
              ))}
              </select>
            </div>

            <div className="column">
              <label>Fast / innleid</label>
              <select
              name="form_of_employement"
              value={formData.form_of_employeement}
              onChange={handleChange}
              >
                <option value="">Velg</option>
                <option value="Fast">Fast</option>
                <option value="Innleid">Innleid</option>
              </select>

              <label>Stillingsprosent</label>
              <select
              name="employee_percentages"
              value={formData.employee_percentages}
              onChange={handleChange}
              >
                <option value="">Velg</option>
                {[...Array(10)].map((_, i) => {
                const pct = (i + 1) * 10;
                return <option key={pct} value={pct}>{pct}%</option>;
              })}
              </select>

              <label>Startdato</label>
              <input 
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
               />

              <label>Sluttdato</label>
              <input 
              type="date" 
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}/>
            </div>
          </div>
        </div>

        {/* === PERMISJON === */}
      <div className="form-section">
        <h2 className="section-heading">Permisjon</h2>
        <div className="two-column">
          <div className="column">
          <label>Permisjonsprosent</label>
            <select
            type="number"
            name="leave_percentage"
            value={formData.leave ? formData.leave.leave_percentage : ''}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                leave: {
                ...prev.leave,
                leave_percentage: e.target.value
              }
            }));
          }}
        >
          <option value="">Velg %</option>
          {[...Array(10)].map((_, i) => {
          const pct = (i + 1) * 10;
          return (
            <option key={pct} value={pct}>
              {pct}%
            </option>
          );
        })}
        </select>

        <label>Startdato permisjon</label>
        <input
          type="date"
          name="leave_start_date"
          value={formData.leave ? formData.leave.leave_start_date : ''}
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              leave: {
                ...prev.leave,
                leave_start_date: e.target.value
              }
            }));
          }}
        />

        <label>Sluttdato permisjon</label>
        <input
          type="date"
          name="leave_end_date"
          value={formData.leave ? formData.leave.leave_end_date : ''}
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              leave: {
                ...prev.leave,
                leave_end_date: e.target.value
              }
            }));
          }}
        />
      </div>
    </div>
  </div>

        {/* SECTION: TILGANGER */}
<div className="form-section">
  <h2 className="section-heading">Tilganger</h2>
  <div className="checkbox-group">
    {allLicenses.map((license) => (
      <label key={license.license_id}>
        <input
          type="checkbox"
          value={license.license_id}
          checked={formData.license.some(
            (l) =>l.license_id === license.license_id
          )}
          onChange={(e) => {
            const isChecked = e.target;
            const licenseId = Number(e.target.value);

            const updatedLicenses = isChecked
            ? [...formData.licenses, {license_id: licenseId}]
            : formData.licenses.filter((l)=> l.license_id !== licenseId);

            setFormData((prev) => ({
              ...prev,
              licenses: updatedLicenses,
            }))
          }}
        >
        </input>
          {license.license_title}
      </label>
    ))}
  </div>
</div>

        <div className="form-buttons">
          <GreenButton text="Lagre" onClick={() => console.log("Lagrer endringer")} />
          {/*** navigere til sider etterhvert!! naviger tilbake profildetaljesiden*/}
          <RedButton text="Avbryt" onClick={() => console.log("Avbryter redigering")} />
        </div>

        </form>

      </div>
    </div>
  );
};

export default EditEmployee;
