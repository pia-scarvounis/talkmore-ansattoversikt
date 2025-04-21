// src/pages/NavPages.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../redux/slices/employeeSlice";
import ProfilePageTemplate from "./ProfilePageTemplate";

const NavPages = () => {
  const dispatch = useDispatch();
  const { team } = useParams(); // feks /nav/springfield
  const lowerTeam = team.toLowerCase();

  const { data: employees, loading, error } = useSelector(
    (state) => state.employees
  );

  const [filteredData, setFilteredData] = useState([]);

  // hent alle ansatte når komponenten laster første gang
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Når ansatte eller team endres – filtrer ansatte
  useEffect(() => {
    if (!employees || !Array.isArray(employees)) return;

    console.log("TEAM FRA URL:", lowerTeam);
    console.log("Før filtrering, ansatte:", employees.map(e => ({
      name: e.employee_name,
      team: e.team_name,
      department: e.department_name
    })));

    let result = [];

    if (lowerTeam === "alleansatte") {
      result = employees;
    } else if (["privat", "bedrift", "2.linje"].includes(lowerTeam)) {
      result = employees.filter((emp) => {
        if (!emp.department_name) return false;

        const department = emp.department_name
          .toLowerCase()
          .replace(/\s/g, "")
          .replace(".", "");
        const teamParam = lowerTeam.replace(/\s/g, "").replace(".", "");

        console.log("Sammenligner department:", department, "med teamParam:", teamParam);
        return department === teamParam;
      });
    } else {
      result = employees.filter(
        (emp) => emp.team_name?.toLowerCase() === lowerTeam
      );
    }

    console.log("Resultat etter filtrering:", result);
    setFilteredData(result);
  }, [employees, team]);

  // Overskrift – vis pen tittel med mellomrom ++
  const titleMap = {
    alleansatte: "Alle ansatte",
    cayman: "Cayman Island",
    bedrift: "Bedrift",
    privat: "Privat",
    "2.linje": "2. linje",
    olympia: "Olympia",
    brooklyn: "Brooklyn",
    havana: "Havana",
    casablanca: "Casablanca",
    springfield: "Springfield",
  };

  const title = titleMap[lowerTeam] || team.charAt(0).toUpperCase() + team.slice(1);

  return (
    <ProfilePageTemplate
      title={title}
      data={filteredData}
      loading={loading}
      error={error}
      showStandardFilter={true}
    />
  );
};

export default NavPages;
