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
    const allDepartments = employees
  .map(emp => emp.department_name?.toLowerCase())
  .filter(Boolean);


    let result = [];
    console.log("Admin-ansatte funnet:", result);

    if (lowerTeam === "alleansatte") {
      result = employees;
      setPageTitle("Alle ansatte");
    /* } else if (["privat", "bedrift", "2.linje", "admin"].includes(lowerTeam)) { */
    } else if (allDepartments.includes(lowerTeam)) {

      result = employees.filter(
        (emp) => emp.department_name?.toLowerCase() === lowerTeam
      ); 
      if (result.length > 0) {
        setPageTitle(result[0].department_name); 
      } else {
        setPageTitle(formatTitle(lowerTeam)); 
      }
    } 
    else if (lowerTeam === "admin") {
      // EGEN sjekk for Admin: Vis ansatte med rolle admin
      result = employees.filter(
        (emp) => emp.role?.toLowerCase() === "admin"
      );
    
      if (result.length > 0) {
        setPageTitle("Admin");
      } else {
        setPageTitle("Admin");
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

