import React, { useState, useEffect, Suspense } from "react";
import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import GreenButton from "../components/UI/GreenButton";
import RedButton from "../components/UI/RedButton";
import WhiteButton from "../components/UI/WhiteButton";

import "../styles/form.css";
import defaultImage from "../assets/images/default-img.png";
import trashIcon from "../assets/icons/trash.svg";
import uploadIcon from "../assets/icons/img.svg";
import EditHistoryPopup from "../components/History/EditHistoryPopup"; // for å teste EditHistoryPopupen
import AlertBox from "../components/UI/AlertBox";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateEmployee,
  resetUpdateState,
} from "../redux/slices/AdminSlices/adminEmpl_CrudsSlice";
import { fetchEmployees } from "../redux/slices/employeeSlice";
import { fetchMetaData } from "../redux/slices/metaDataCrudsSlice";

const EditEmployee = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employeeId = parseInt(id, 10);
  // alertbox state:
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    dispatch(fetchMetaData());
  }, [dispatch]);

  const metaData = useSelector((state) => state.metaData);
  console.log("metaData fra Redux:", metaData);

  if (!id) return <div>Mangler ID</div>;

  //henter den ansatte fra get employeeSlicen og finner ansatte med id lik url
  const employee = useSelector((state) => {
    if (!id || !state.employees?.data) return null;
    return state.employees.data.find((emp) => emp.employee_id === Number(id));
  });

  //Uthenting av avdeling/Teams/stillinger
  const { departments, teams, posistions } = useSelector(
    (state) => state.metaData
  );
  //alle lisenser
  const { licenses: allLicenses } = useSelector((state) => state.metaData);
  //Henter fra updateEmployeeSlicen
  const { loading, success, error } = useSelector(
    (state) => state.updateEmployee
  );

  //vi må bruke formdata
  const [formData, setFormData] = useState(null);
  const [filteredTeams, setfilteredTeams] = useState([]);

  const [didSave, setDidSave] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!employee) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employee]);

  //Etter henting av ansatt så setter vi inn data
  //Det må hentes på denne måten og ikke oppdatere i selve endre ansatt Slicen da backend ikke returnerer
  //listen, og versions id fra api genesys kan endre seg og settes inn i oppdatert ansatt

  //Setter data og lar eksisterene data være i feltene
  useEffect(() => {
    if (employee && teams.length > 0) {
      console.log("Teams fra Redux/metaData:", teams);

      const deptId = employee.department_id
        ? String(employee.department_id)
        : "";
      const teamId = employee.team_id ? String(employee.team_id) : "";
      const workPosistionId = employee.workPosistion_id?.toString() || "";

      const filtered = teams.filter(
        (t) => t.team_department_id?.toString() === deptId
      );
      setfilteredTeams(filtered);

      console.log("employee.department_id:", employee.department_id);
      console.log("employee.team_id:", employee.team_id);

      setFormData({
        employee_name: employee.employee_name || "",
        epost: employee.epost || "",
        epost_Telenor: employee.epost_Telenor || "",
        phoneNr: employee.phoneNr || "",
        birthdate: employee.birthdate ? employee.birthdate.split("T")[0] : "",
        start_date: employee.start_date
          ? employee.start_date.split("T")[0]
          : "",
        end_date: employee.end_date ? employee.end_date.split("T")[0] : "",
        form_of_employeement: employee.form_of_employeement || "",
        employeeNr_Talkmore: employee.employeeNr_Talkmore || "",
        employeeNr_Telenor: employee.employeeNr_Telenor || "",
        employee_percentages: employee.employee_percentages || "",
        department_id: deptId,
        team_id: teamId,
        workPosistion_id: workPosistionId,
        licenses: employee.licenses || [],
        relative: employee.relative || [],
        leave: employee.leave || {
          leave_percentage: "",
          leave_start_date: "",
          leave_end_date: "",
        },
      });
    }
  }, [employee, teams]);

  console.log("Teams fra Redux:", JSON.stringify(teams, null, 2));

  useEffect(() => {
    if (formData?.department_id && teams.length > 0) {
      const filtered = teams.filter(
        (t) => t.team_department_id?.toString() === formData.department_id
      );
      setfilteredTeams(filtered);
      console.log("Filtered teams:", filtered);
    }
  }, [formData?.department_id, teams]);
  console.log("formData.department_id:", formData?.department_id);

  //oppdaterer formData (objektet ansatt info) med input
  const handleChange = (e) => {
    const { name, value } = e.target;

    //fjern alt som ikke er tall i tlf felt
    const cleanedValue =
      name === "phoneNr" || name === "relative_phoneNr"
        ? value.replace(/[^\d+]/g, "")
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };

  //Når bruker endrer avdeling i options
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      department_id: departmentId,
      team_id: "",
    }));
    const filtered = teams.filter(
      (t) => t.department_id?.toString() === departmentId
    );
    setfilteredTeams(filtered);
  };

  console.log("department_id:", formData?.department_id);
  console.log("filteredTeams:", filteredTeams);
  console.log(
    "selected option:",
    departments.find(
      (dep) => dep.department_id.toString() === formData?.department_id
    )
  );

  const handleLicenseChange = (e) => {
    const isChecked = e.target.checked;
    const licenseId = Number(e.target.value);
    const updated = isChecked
      ? [...formData.licenses, { license_id: licenseId }]
      : formData.licenses.filter((l) => l.license_id !== licenseId);
    setFormData((prev) => ({ ...prev, licenses: updated }));
  };

  //Dato konverter for date i Leave (permisjon dato)
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr.split("T")[0];
  };

  //lagre
  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!formData) return;

    // Valider permisjon: Startdato krever sluttdato
    if (
      formData.leave &&
      formData.leave.leave_start_date &&
      !formData.leave.leave_end_date
    ) {
      // Vis error AlertBox i stedet for alert()
      setErrorMessage(
        "Du må fylle inn sluttdato for permisjon hvis startdato er satt."
      );
      setShowError(true);
      return;
    }

    if (
      formData.leave &&
      formData.leave.leave_end_date &&
      !formData.leave.leave_start_date
    ) {
      setErrorMessage(
        "Du må fylle inn startdato for permisjon hvis sluttdato er satt."
      );
      setShowError(true);
      return;
    }

    //returner en ny formData med riktig date toIso string for leave feltene i formdata + formdata
    const fixFormData = {
      ...formData,
      leave: formData.leave
        ? {
            ...formData.leave,
            leave_start_date: formatDate(
              formData.leave.leave_start_date || null
            ),
            leave_end_date: formatDate(formData.leave.leave_end_date || null),
          }
        : null,
    };
    setDidSave(true);
    //sender inn oppdatert ansatt objektet som formData i fetchen
    dispatch(updateEmployee({ id, updatedEmployeeData: fixFormData }));
  };

  // lagre og avbryt knapper - alert boxes
  const confirmCancel = () => {
    dispatch(resetUpdateState());
    setShowSuccess(false);
    // Naviger tilbake til profilsiden til brukeren
    setTimeout(() => {
      navigate(`/employee-info/${id}`);
    }, 0);
  };

  const cancelCancel = () => {
    // Lukker popupen
    setShowCancelConfirm(false);
  };

  //etter vellykket oppdatering
  useEffect(() => {
    if (success && didSave && !confirmCancel) { // viser kun suksess popup hvis ikke confirmcancel trykkes på.!
      dispatch(fetchEmployees());
      dispatch(resetUpdateState());
      setShowSuccess(true); // vise success
      setDidSave(false);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/employee-info/${id}`);
      }, 3000);
    }
    if (error) {
      setErrorMessage("Feil: " + error);
      setShowError(true);
      dispatch(resetUpdateState());
    }
  }, [success, error, dispatch, navigate, didSave, confirmCancel]);

  if (!formData) {
    return <div>Laster ansatt...</div>;
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
                  onChange={handleChange}
                />

                <label>Telefonnummer</label>
                <input
                  type="tel"
                  name="phoneNr"
                  pattern="[+0-9]*"
                  inputMode="numeric"
                  value={formData.phoneNr}
                  onChange={handleChange}
                />

                <label>Fødselsdato</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </div>

              <div className="column">
                <label>Epost (Talkmore)</label>
                <input
                  type="email"
                  name="epost"
                  value={formData.epost}
                  onChange={handleChange}
                />

                <label>Epost (Telenor)</label>
                <input
                  type="email"
                  name="epost_Telenor"
                  value={formData.epost_Telenor}
                  onChange={handleChange}
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
                  value={
                    formData.relative.length > 0
                      ? formData.relative[0].relative_name
                      : ""
                  }
                  onChange={(e) => {
                    //if (formData.relative.length > 0) {
                    const updated = {
                      ...formData.relative[0],
                      relative_name: e.target.value,
                      relative_phoneNr:
                        formData.relative[0]?.relative_phoneNr || "",
                    };
                    setFormData((prev) => ({
                      ...prev,
                      relative: [updated],
                    }));
                    // }
                  }}
                />
              </div>
              <div className="column">
                <label>Telefonnummer</label>
                <input
                  type="tel"
                  name="relative_phoneNr"
                  pattern="[+0-9]*"
                  inputMode="numeric"
                  value={formData.relative[0]?.relative_phoneNr || ""}
                  onChange={(e) => {
                    const existing = formData.relative[0] || {};
                    //tlf
                    const cleanednr = e.target.value.replace(/[^\d+]/g, ""); //behold kun tall

                    const updated = {
                      ...existing,
                      relative_phoneNr: cleanednr,
                      relative_name: existing.relative_name || "",
                    };
                    setFormData((prev) => ({ ...prev, relative: [updated] }));
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
                  onChange={handleChange}
                />

                <label>Ansattnummer (Telenor)</label>
                <input
                  type="number"
                  name="employeeNr_Telenor"
                  value={formData.employeeNr_Telenor}
                  onChange={handleChange}
                />

                {/**MÅ HENTE INN rutere for å hente team og stillinger fra databasen */}
                {/**Avdeling og team */}
                <label>Avdeling</label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleDepartmentChange}
                >
                  <option value="">Velg avdeling</option>
                  {departments.map((dep) => (
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
                  <option value="">Velg</option>
                  {filteredTeams.map((team) => (
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
                  <option value="">Velg stilling</option>
                  {posistions.map((posistion) => (
                    <option
                      key={posistion.workPosistion_id}
                      value={posistion.workPosistion_id.toString()}
                    >
                      {posistion.posistion_title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="column">
                <label>Fast / innleid</label>
                <select
                  name="form_of_employeement"
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
                    return (
                      <option key={pct} value={pct}>
                        {pct}%
                      </option>
                    );
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
                  onChange={handleChange}
                />
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
                  value={formData.leave ? formData.leave.leave_percentage : ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      leave: {
                        ...prev.leave,
                        leave_percentage: e.target.value,
                      },
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
                  value={
                    formData.leave
                      ? formData.leave.leave_start_date?.split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      leave: {
                        ...prev.leave,
                        leave_start_date: e.target.value,
                      },
                    }));
                  }}
                />

                <label>Sluttdato permisjon</label>
                <input
                  type="date"
                  name="leave_end_date"
                  value={
                    formData.leave
                      ? formData.leave.leave_end_date?.split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      leave: {
                        ...prev.leave,
                        leave_end_date: e.target.value,
                      },
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
                    checked={formData.licenses.some(
                      (l) => l.license_id === license.license_id
                    )}
                    onChange={handleLicenseChange}
                  ></input>
                  {license.license_title}
                </label>
              ))}
            </div>
          </div>

          <div className="form-buttons">
            <GreenButton
              text="Lagre"
              message="Ansattdata er oppdatert."
              onClick={handleSubmit}
            />
            {showSuccess && (
              <AlertBox
                type="success"
                title="Lagret!"
                message="Ansattdata er oppdatert."
              ></AlertBox>
            )}

            {/*** navigere til sider etterhvert!! naviger tilbake profildetaljesiden*/}
            <RedButton
              text="Avbryt"
              onClick={() => setShowCancelConfirm(true)}
            />
          </div>
        </form>
        {showCancelConfirm && (
          <AlertBox
            type="confirmation"
            title="Avbryt endringer"
            message="Er du sikker på at du vil avbryte? Endringer du har gjort vil ikke bli lagret."
          >
            <RedButton text="Ja, avbryt" onClick={confirmCancel} />
            <WhiteButton text="Fortsett" onClick={cancelCancel} />
          </AlertBox>
        )}
        {showError && (
          <AlertBox type="error" title="Feil!" message={errorMessage}>
            <RedButton text="Lukk" onClick={() => setShowError(false)} />
          </AlertBox>
        )}
      </div>
    </div>
  );
};

export default EditEmployee;
