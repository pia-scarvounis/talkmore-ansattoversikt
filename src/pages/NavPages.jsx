// src/pages/NavPages.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../redux/slices/employeeSlice";
import EmployeeListTemplate from "../components/Employee/EmployeeListTemplate";


const NavPages = () => {
  const dispatch = useDispatch();
  const { team } = useParams(); // f.eks. /nav/springfield
  const lowerTeam = team.toLowerCase();

  const titleMap = {
    alleansatte: "Alle ansatte",
    caymanisland: "Cayman Island",
    bedrift: "Bedrift",
    privat: "Privat",
    "2.linje": "2. linje",
    olympia: "Olympia",
    brooklyn: "Brooklyn",
    havana: "Havana",
    casablanca: "Casablanca",
    springfield: "Springfield",
    performancemanagement: "Performance Management",
  }; // ikke bra løsnong. fiks senere

  const { data: employees, loading, error } = useSelector(
    (state) => state.employees
  );
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (!employees || !Array.isArray(employees)) return;

    let result = [];

    if (lowerTeam === "alleansatte") {
      result = employees;
    } else if (["privat", "bedrift", "2.linje"].includes(lowerTeam)) {
      result = employees.filter(
        (emp) => emp.department_name?.toLowerCase() === lowerTeam
      );
    } else {
      result = employees.filter(
        (emp) => emp.team_name?.toLowerCase() === lowerTeam
      );
    }

    setFilteredData(result);
  }, [employees, team]);


  const title = titleMap[lowerTeam] || team.charAt(0).toUpperCase() + team.slice(1);

  return (
    <EmployeeListTemplate
      title={title}
      data={filteredData}
      loading={loading}
      error={error}
      showStandardFilter={true}
      showDate={false}
    />
  );
};

export default NavPages;

