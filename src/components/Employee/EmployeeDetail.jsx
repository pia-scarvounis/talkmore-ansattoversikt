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
              <h2><u>{employee.employee_name}</u></h2>

              {employee.employeeNr_Talkmore && (
                <p>
                  <strong>Ansattnr (Talkmore):</strong>{" "}
                  {employee.employeeNr_Talkmore}
                </p>
              )}
              <p>Ansattnr (Innleid): xxxxxxxx</p>
            </div>

            <img src={defaultImg} alt="Profilbilde" className="employee-img" />

            <p>Fødselsdato: {formatDate(employee.birthdate)}</p>
            
            {employee.phoneNr ? (
  <p><strong>Telefon:</strong> {employee.phoneNr}</p>
) : (
  <p><strong>Telefon:</strong> Ikke oppgitt</p>
)}

              E-post:
              {employee.epost ? (
                <p>E-post: {employee.epost}</p>
              ) : (
                <p>E-post ikke oppgitt</p>
              )}
            {employee.epost_Telenor && (
              <p>E-post (Telenor): {employee.epost_Telenor}</p>
            )}
          </div>
        </div>

        {/* Midtseksjon */}
        <div className="employee-position-info">
          <div className="employee-position-inner">
            <h4>Stillinginformasjon</h4>
            <p>
              <strong>Startdato:</strong> 20.02.14
            </p>
            <p>
              <strong>Sluttdato:</strong> 31.12.25
            </p>
            <p>
              <strong>Fast/Inleid:</strong>
              {employee.form_of_employeement}
            </p>
            <p>
              <strong>Stilling:</strong>
              {employee.workPosistion_title}
            </p>
            <p>
              <strong>Team:</strong> Havanna
            </p>
            <p>
              <strong>Avd.:</strong> Privat
            </p>
            <p>
              <strong>Stillingsprosent:</strong>
              {employee.employee_percentages}%
            </p>
            <p>
              <strong>Permisjon:</strong> 0%
            </p>
          </div>
        </div>

        {/* Høyre seksjon */}
        <div className="employee-emergency-access">
          <div className="employee-emergency-inner">
            <h4>Nærmeste pårørende</h4>
            <p>
              <strong>Navn:</strong>
              {relative ? relative.relative_name : "-"}
            </p>
            <p>
              <strong>Telefon:</strong>
              {relative ? relative.phone_number : "-"}
            </p>

            <h4>Tilganger</h4>
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
