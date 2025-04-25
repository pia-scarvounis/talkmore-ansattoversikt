import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailableEmployees } from "../redux/slices/availableemployeesSlice";
import EmployeeListTemplate from "../components/Employee/EmployeeListTemplate";

const DashboardPages = () => {
  const { filterKey } = useParams(); 
  const dispatch = useDispatch();

  const selectedDate = useSelector((state) => state.date.selectedDate);
  const { data: employees, loading, error } = useSelector((state) => state.availableEmployees);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchAvailableEmployees(selectedDate));
  }, [dispatch, selectedDate]);

  useEffect(() => {
    if (!employees || !Array.isArray(employees)) return;

    let result = [];

    switch (filterKey) {
      case "teamleder":
        result = employees.filter((e) => e && e.workPosistion_title === "Teamleder" && e.is_logged_in);
        break;
      case "admin":
        result = employees.filter((e) => e && e.workPosistion_title === "Admin" && e.is_logged_in);
        break;
      case "kundeagent":
        result = employees.filter((e) => e && e.workPosistion_title === "Kundeagent" && e.is_logged_in);
        break;
      case "fast":
        result = employees.filter((e) => e && e.form_of_employeement === "Fast" && e.is_logged_in);
        break;
      case "innleid":
        result = employees.filter((e) => e && e.form_of_employeement === "Innleid" && e.is_logged_in);
        break;
      case "heltid":
        result = employees.filter((e) => e && e.employee_percentages === 100 && e.is_logged_in);
        break;
      case "deltid":
        result = employees.filter((e) => e && e.employee_percentages < 100 && e.is_logged_in);
        break;
      default:
        result = [];
    }
    

    setFilteredData(result);
  }, [employees, filterKey]);

  // overskrift basert på filterKey. dårlig løsning - finn ut av det hvis tid senere både her og nav-pages
  const titleMap = {
    teamleder: "Teamledere",
    admin: "KS Admin",
    kundeagent: "Kundeansvarlige",
    fast: "Telenoransatte",
    innleid: "Innleide",
    heltid: "Heltid",
    deltid: "Deltid",
  };

  const title = titleMap[filterKey] || "Filtrerte ansatte";

  return (
    <EmployeeListTemplate
      title={title}
      data={filteredData}
      loading={loading}
      error={error}
      showStandardFilter={false}
      showDate={true}
    />
  );
};

export default DashboardPages;
