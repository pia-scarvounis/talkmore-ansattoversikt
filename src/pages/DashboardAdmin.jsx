import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavAdmin from "../components/navigation/NavAdmin";
import StatBox from "../components/Dashboard/StatBox";
import EventBox from "../components/Dashboard/EventBox";

import "../styles/dashboard.css";
import iconKSAdmin from "../assets/icons/ks-admin.svg";
import iconKA from "../assets/icons/ka.svg";
import iconFTE from "../assets/icons/fte.svg";
import iconTL from "../assets/icons/tl.svg";

//import { fetchAvailableEmployees } from "../redux/slices/availableemployeesSlice";
import { fetchDayOverviewEmployees } from "../redux/slices/dayOverviewEmpSlice";
import { fetchEmployees } from "../redux/slices/employeeSlice";
import DateSelector from "../components/UI/DateSelector";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

const DashboardAdmin = () => {
  //redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBoxClick = (filterKey) => {
    navigate(`/dashboardlist/${filterKey}`);
  }; // statbox trigges når den trykkes og sender videre til riktig sted
  const user = useSelector((state) => state.auth.user);
  const selectedDateString = useSelector((state) => state.date.selectedDate);
  const selectedDate = new Date(selectedDateString);
  const { data: employees, loading } = useSelector(
    (state) => state.dayOverviewEmployees
  );
  console.log("dagsoversikt:", employees);

  const rawDate = format(selectedDate, "EEEE d. MMMM yyyy", {
    locale: nb,
  });

  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  //henter fetch for tilgjengelige ansatte og setter inn availableemployee slicen
  useEffect(() => {
    //sender inn valgt dato til fetchen
    dispatch(fetchDayOverviewEmployees(selectedDateString));
    dispatch(fetchEmployees());
  }, [dispatch, selectedDateString]);

  //sjekker at employees er et array
  const getCount = (filterFn) => {
    if (!Array.isArray(employees)) return 0;
    return employees.filter(filterFn).length;
  };
  //Tester ekstra lagring
  //tester denne gpt snittet + sjekk av om employees er array og ikke undefined
  //den skal telle antall fte med 100% = 1 fte untatt de som er på permisjon/ de som har sluttet vil ikke dukke opp i get employees
  const totalFTE = Array.isArray(employees)
    ? employees.reduce((acc, employee) => {
        const pct = Number(employee.employee_percentages);
        return acc + (isNaN(pct) ? 0 : pct / 100); // Legg til som FTE, ikke %
      }, 0)
    : 0;

  const formattedFTE = totalFTE.toFixed(2); // Eks: 107.00

  return (
    <div className="dashboard-layout">
      <NavAdmin />

      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-welcome">
            velkommen, {user?.username || "Ukjent bruker"}
          </div>
          <div className="dashboard-dategroup">
            <span className="pageContent-text">{formattedDate}</span>
            <DateSelector />
          </div>
        </div>
      </div>

      <div className="dashboard-wrapper">
        <div className="left-column">
          {loading ? (
            <p>Laster tilgjengelige ansatte</p>
          ) : (
            <div className="dashboard-grid">
              <StatBox
                title="TEAMLEDER"
                value={getCount((e) => e.workPosistion_title === "Teamleder")}
                unit="Tilgjengelig"
                icon={iconTL}
                onClick={() => handleBoxClick("teamleder")}
              />
              <StatBox
                title="KS ADMIN"
                value={getCount((e) => e.workPosistion_title === "Admin")}
                unit="Tilgjengelig"
                icon={iconKSAdmin}
                onClick={() => handleBoxClick("admin")}
              />
              <StatBox
                title="KUNDEAGENT"
                value={getCount((e) => e.workPosistion_title === "Kundeagent")}
                unit="Tilgjengelig"
                icon={iconKA}
                onClick={() => handleBoxClick("kundeagent")}
              />

              <StatBox
                title="TELENORANSATT"
                value={getCount((e) => e.form_of_employeement === "Fast")}
                unit="Tilgjengelig"
                icon={iconKA}
                onClick={() => handleBoxClick("fast")}
              />
              <StatBox
                title="INNLEID"
                value={getCount((e) => e.form_of_employeement === "Innleid")}
                unit="Tilgjengelig"
                icon={iconKA}
                onClick={() => handleBoxClick("innleid")}
              />

              <StatBox
                title="HELTID"
                value={getCount((e) => e.employee_percentages === 100)}
                unit="Tilgjengelig"
                icon={iconKA}
                onClick={() => handleBoxClick("heltid")}
              />
              <StatBox
                title="DELTID"
                value={getCount((e) => e.employee_percentages < 100)}
                unit="Tilgjengelig"
                icon={iconKA}
                onClick={() => handleBoxClick("deltid")}
              />

              <StatBox
                title="FULLTIDSEKVIVALENTER"
                //setter en 100 % stilling = 1
                value={formattedFTE}
                unit="FTE"
                highlight
                className="fte"
                icon={iconFTE}
              />
            </div>
          )}
        </div>
        <div className="right-column">
          <EventBox />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
