import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../redux/slices/employeeSlice";
import EmployeeListTemplate from "../components/Employee/EmployeeListTemplate";


const NavPages = () => {
  const dispatch = useDispatch();
  const { team } = useParams(); 
  const lowerTeam = team.toLowerCase();


  const { data: employees, loading, error } = useSelector(
    (state) => state.employees
  );
  const [filteredData, setFilteredData] = useState([]);
  const [pageTitle, setPageTitle] = useState("");


  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);
  

  useEffect(() => {
    if (!employees || !Array.isArray(employees)) return;

    let result = [];

    if (lowerTeam === "alleansatte") {
      result = employees;
      setPageTitle("Alle ansatte");
    } else if (["privat", "bedrift", "2.linje"].includes(lowerTeam)) {
      result = employees.filter(
        (emp) => emp.department_name?.toLowerCase() === lowerTeam
      );
      if (result.length > 0) {
        setPageTitle(result[0].department_name); 
      } else {
        setPageTitle(formatTitle(lowerTeam)); 
      }
    } 
    else {
      // hvis vi er på team (alle andre team)
      result = employees.filter(
        (emp) => emp.team_name?.toLowerCase().replaceAll(" ", "_") === lowerTeam
      );
  
      if (result.length > 0) {
        setPageTitle(result[0].team_name);
      } else {
        setPageTitle(formatTitle(lowerTeam)); 
      }
    }
    setFilteredData(result);
  }, [employees, team]);
  const formatTitle = (value) => {
    if (!value) return "Filtrerte ansatte";
    return value.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());
  };
 

  return (
    <EmployeeListTemplate
      title={pageTitle}
      data={filteredData}
      loading={loading}
      error={error}
      showStandardFilter={true}
      showDate={false}
    />
  );
};

export default NavPages;

