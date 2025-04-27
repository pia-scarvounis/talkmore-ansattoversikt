import React from "react";
import { useSelector } from "react-redux";
import defaultImg from "../../assets/images/default-img.png";
import "../../styles/EmployeeInfo.css";
import { format } from "date-fns";

const EmployeeDetail = ({ employeeId }) => {
  const employees = useSelector((state) => state.employees.data);

  const employee = employees.find((emp) => emp.employee_id === employeeId);
  if (!employee) {
    return <p>Fant ikke ansatt</p>;
  }

  // hjelpefunksjon datoformat - gjør dato pen og ikke rotete
  const formatDate = (dateString) => {
    if (!dateString) return "Ikke oppgitt";
    return format(new Date(dateString), "dd.MM.yyyy");
  };

  // Henter første pårørende hvis det finnes
  const relative =
    employee.relative && employee.relative.length > 0
      ? employee.relative[0]
      : null;

  return (
    <div className="employee-detail-container">
      <div className="employee-detail-card">
        {/* Venstre seksjon */}
        <div className="employee-info">
          <div className="employee-info-inner">
            <div className="employee-info-text">
              <h2>{employee.employee_name}</h2>

              {employee.employeeNr_Talkmore && (
                <p>
                  <strong>Ansattnr</strong> (Talkmore):{" "}
                  {employee.employeeNr_Talkmore}
                </p>
              )}
              <p>
                <strong>Ansattnr</strong> (Innleid): {" "}
                {employee.employeeNr_Telenor}
              </p>
            </div>

            <img src={defaultImg} alt="Profilbilde" className="employee-img" />

            <p>
              <strong>Fødselsdato:</strong> {formatDate(employee.birthdate)}
            </p>
            <p>
              <strong>Telefon:</strong>{" "}
              {employee.phoneNr ? employee.phoneNr : "Ikke oppgitt"}
            </p>

            <p>
              <strong>E-post:</strong>{" "}
              {employee.epost ? employee.epost : "Ikke oppgitt"}
            </p>

            {employee.epost_Telenor && (
              <p>
                <strong>E-post</strong> (Telenor): {employee.epost_Telenor}
              </p>
            )}
          </div>
        </div>

        {/* Midtseksjon */}
        <div className="employee-position-info">
          <div className="employee-position-inner">
            <h4><u>Stillinginformasjon</u></h4>
            <p>
              <strong>Startdato:</strong>{" "}
              {employee.start_date
                ? formatDate(employee.start_date)
                : "Ikke oppgitt"}
            </p>
            <p>
              <strong>Sluttdato:</strong>{" "}
              {employee.end_date
                ? formatDate(employee.end_date)
                : "Ikke oppgitt"}
            </p>
            <p>
              <strong>Fast/Inleid:</strong> {employee.form_of_employeement || "Ikke oppgitt"}
            </p>
            <p>
              <strong>Stilling:</strong> {employee.workPosistion_title || "Ikke oppgitt"}
            </p>
            <p>
              <strong>Team:</strong> {employee.team_name || "Ikke oppgitt"}
            </p>
            <p>
              <strong>Stillingsprosent:</strong> {employee.employee_percentages !== undefined
                ? `${employee.employee_percentages} %`
                : "Ikke oppgitt"}
            </p>
            <p>
              <strong>Permisjon:</strong>{" "}
              {/* denne er fortsatt dummy fordi permisjon-tabellen ikke er koblet riktig opp */}
              0% {/* kan byttes ut senere hvis vi lager permisjonsdata */}
            </p>
          </div>
        </div>

        {/* Høyre seksjon */}
        <div className="employee-emergency-access">
          <div className="employee-emergency-inner">
            <h4><u>Nærmeste pårørende</u></h4>
            <p>
              <strong>Navn pårørende:</strong> {relative?.relative_name || "Ikke oppgitt"}
            </p>
            <p>
              <strong>Telefon pårørende:</strong> {relative?.phone_number || "Ikke oppgitt"}
            </p>

            <h4><u>Tilganger</u></h4>
            <div className="access-checkboxes">
              <label>
                <input type="checkbox" />
                Eks 3
              </label>
              <label>
                <input type="checkbox" />
                Word
              </label>
              <label>
                <input type="checkbox" />
                Eks 2
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
