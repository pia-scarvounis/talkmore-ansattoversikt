import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/alert.css";
import AlertBox from "../UI/AlertBox";

const ExportCSVButton = ({ filteredEmployees }) => {
  const [showAlert, setShowAlert] = useState(false);

  // Bruk filtrerte ansatte hvis det finnes, ellers alle ansatte
  const allEmployees = useSelector((state) => state.employees.data);
  const employeesToExport =
    filteredEmployees && filteredEmployees.length > 0
      ? filteredEmployees
      : allEmployees;

  const handleDownload = () => {
    if (!employeesToExport || employeesToExport.length === 0) return;

    const headers = [
      "Navn",
      "E-post",
      "E-post Telenor",
      "Telefon",
      "Fødselsdato",
      "Startdato",
      "Sluttdato",
      "Form",
      "Ansattnr Talkmore",
      "Ansattnr Telenor",
      "Prosent",
      "Stilling",
      "Team",
      "Avdeling",
      "Lisens(er)",
      "Permisjon",
    ];

    const rows = employeesToExport.map((emp) => [
      emp.employee_name,
      emp.epost,
      emp.epost_Telenor || "",
      emp.phoneNr || "",
      emp.birthdate?.split("T")[0] || "",
      emp.start_date?.split("T")[0] || "",
      emp.end_date?.split("T")[0] || "",
      emp.form_of_employeement,
      emp.employeeNr_Talkmore,
      emp.employeeNr_Telenor,
      emp.employee_percentages,
      emp.workPosistion_title,
      emp.team_name,
      emp.department_name,
      emp.licenses?.map((l) => l.license_title).join("; ") || "",
      emp.leave,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ansatte.csv";
    a.click();
    URL.revokeObjectURL(url);

    // Vis alert i 3 sekunder
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <>
      <button onClick={handleDownload} className="export-button">
        Last ned CSV
      </button>

      {showAlert && (
        <AlertBox
          type="success"
          title="CSV generert!"
          message="Listen over ansatte ble lastet ned som CSV-fil."
        ></AlertBox>
      )}
    </>
  );
};

export default ExportCSVButton;
