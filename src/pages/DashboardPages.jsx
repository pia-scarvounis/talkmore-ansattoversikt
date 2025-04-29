import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDayOverviewEmployees } from "../redux/slices/dayOverviewEmpSlice";
import EmployeeListTemplate from "../components/Employee/EmployeeListTemplate";

const DashboardPages = () => {
  const { filterKey } = useParams();
  const dispatch = useDispatch();

  const selectedDate = useSelector((state) => state.date.selectedDate);
  const {
    data: employees,
    loading,
    error,
  } = useSelector((state) => state.dayOverviewEmployees);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchDayOverviewEmployees(selectedDate));
  }, [dispatch, selectedDate]);

  useEffect(() => {
    if (!employees || !Array.isArray(employees)) return;

    let result = [];

    switch (filterKey) {
      case "teamleder":
        result = employees.filter(
          (e) => e && e.workPosistion_title === "Teamleder"
        );
        break;
      case "admin":
        result = employees.filter(
          (e) => e && e.workPosistion_title === "Admin"
        );
        break;
      case "kundeagent":
        result = employees.filter(
          (e) => e && e.workPosistion_title === "Kundeagent"
        );
        break;
      case "fast":
        result = employees.filter(
          (e) => e && e.form_of_employeement === "Fast"
        );
        break;
      case "innleid":
        result = employees.filter(
          (e) => e && e.form_of_employeement === "Innleid"
        );
        break;
      case "heltid":
        result = employees.filter((e) => e && e.employee_percentages === 100);
        break;
      case "deltid":
        result = employees.filter((e) => e && e.employee_percentages < 100);
        break;
      default:
        result = [];
    }

    setFilteredData(result);
  }, [employees, filterKey]);

  // overskrift basert på filterKey. dårlig løsning - finn ut av det hvis tid senere både her og nav-pages
  const titleMap = {
    teamleder: "Teamleder",
    admin: "KS Admin",
    kundeagent: "Kundeansvarlig",
    fast: "Telenoransatt",
    innleid: "Innleid",
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
