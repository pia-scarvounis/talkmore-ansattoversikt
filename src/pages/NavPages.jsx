// src/pages/NavPages.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ProfilePageTemplate from "./ProfilePageTemplate";

// Dummydata – realistisk tilpasset databasen
const dummyEmployees = [
  {
    employee_name: "Ola Nordmann",
    employeeNr_Talkmore: 12345,
    employeeNr_Telenor: 54321,
    form_of_employeement: "Fast",
    employee_percentages: 100,
    team_name: "Brooklyn",
    department_name: "Privat",
    workPosistion_title: "Teamleder",
    image_url: "default-img.png",
  },
  {
    employee_name: "Kari Hansen",
    employeeNr_Talkmore: 23456,
    employeeNr_Telenor: 65432,
    form_of_employeement: "Innleid",
    employee_percentages: 80,
    team_name: "Casablanca",
    department_name: "Privat",
    workPosistion_title: "KundeAgent",
    image_url: "default-img.png",
  },
  {
    employee_name: "Arne Admin",
    employeeNr_Talkmore: 34567,
    employeeNr_Telenor: 76543,
    form_of_employeement: "Fast",
    employee_percentages: 100,
    team_name: "Caymanisland",
    department_name: "Bedrift",
    workPosistion_title: "Admin",
    image_url: "default-img.png",
  },
  {
    employee_name: "Lea Linje",
    employeeNr_Talkmore: 45678,
    employeeNr_Telenor: 87654,
    form_of_employeement: "Innleid",
    employee_percentages: 60,
    team_name: "Olympia",
    department_name: "2.Linje",
    workPosistion_title: "KundeAgent",
    image_url: "default-img.png",
  },
];

const NavPages = () => {
  const { team } = useParams(); // f.eks. "privat", "brooklyn", "bedrift"
  let title = "";
  let filteredData = [];

  const lowerTeam = team.toLowerCase();

  if (["privat", "bedrift", "2.linje"].includes(lowerTeam)) {
    // Navigasjonslenke som viser alle i en avdeling
    title = team.charAt(0).toUpperCase() + team.slice(1);
    filteredData = dummyEmployees.filter(
      (emp) => emp.department_name.toLowerCase() === lowerTeam
    );
  } else {
    // Enkeltside for team
    title = team.charAt(0).toUpperCase() + team.slice(1);
    filteredData = dummyEmployees.filter(
      (emp) => emp.team_name.toLowerCase() === lowerTeam
    );
  }

  return (
    <ProfilePageTemplate
      title={title}
      showStandardFilter={true}
      data={filteredData}
    />
  );
};

export default NavPages;

