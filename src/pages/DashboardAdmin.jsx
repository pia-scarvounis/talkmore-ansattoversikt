import React, { useEffect, useState } from "react";
import NavAdmin from "../components/navigation/NavAdmin";
import StatBox from "../components/Dashboard/StatBox";
import EventBox from "../components/Dashboard/EventBox";

import "../styles/dashboard.css";
import iconKSAdmin from "../assets/icons/ks-admin.svg";
import iconKA from "../assets/icons/ka.svg";
import iconFTE from "../assets/icons/fte.svg";
import iconTL from "../assets/icons/tl.svg";

import { fetchAvailableEmployees } from "../redux/slices/availableemployeesSlice";
import DateSelector from "../components/UI/DateSelector";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import SearchField from "../components/Filters/SearchField";
import { daysInWeek } from "date-fns/constants";

const DashboardAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");

  //redux 
  const dispatch = useDispatch();
  const selectedDateString = useSelector((state) => state.date.selectedDate);
  const selectedDate = new Date(selectedDateString);
  const {data: employees, loading } = useSelector((state) => state.availableEmployees);
  console.log("Tilgjengelige ansatte:", employees);

  const rawDate = format(selectedDate, "EEEE d. MMMM yyyy", {
    locale: nb,
  });

  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  //henter fetch for tilgjengelige ansatte og setter inn availableemployee slicen
  useEffect(()=>{

    //sender inn valgt dato til fetchen
    dispatch(fetchAvailableEmployees(selectedDateString));
  },[dispatch,selectedDateString]);

  //sjekker at employees er et array
  const getCount = (filterFn) => {
    if (!Array.isArray(employees)) return 0;
    return employees.filter(filterFn).length;
  };
  

  //tester denne gpt snittet + sjekk av om employees er array og ikke undefined
  //den skal telle antall fte med 100% = 1 fte
  const totalFTE = Array.isArray(employees)
  ? employees.reduce((acc, employee) => {
      const pct = Number(employee.employee_percentages);
      return acc + (isNaN(pct) ? 0 : pct / 100); // <- Legg til som FTE, ikke %
    }, 0)
  : 0;

  const formattedFTE = totalFTE.toFixed(2); // Eks: 107.00



  return (
    <div className="dashboard-layout">
      <NavAdmin />

      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-dategroup">
            <span className="pageContent-text">{formattedDate}</span>
            <DateSelector />
          </div>
          <div className="dashboard-search">
            <SearchField onSearch={(value) => setSearchTerm(value)} />
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
              title="TEAMLEDERE"
              value={getCount((e)=> e.workPosistion_title === 'Teamleder' && e.is_logged_in)}
              unit="Tilgjengelig"
              icon={iconTL}
            />
            <StatBox
              title="KS ADMIN"
              value={getCount((e) => e.workPosistion_title === 'Admin' && e.is_logged_in)}
              unit="Tilgjengelig"
              icon={iconKSAdmin}
            />
            <StatBox
              title="KUNDEANSVARLIG"
              value={getCount((e) => e.workPosistion_title === 'Kundeagent' && e.is_logged_in)}
              unit="Tilgjengelig"
              icon={iconKA}
            />

            <StatBox
              title="TELENORANSATTE"
              value={getCount((e) => e.form_of_employeement === 'Fast' && e.is_logged_in)}
              unit="Tilgjengelig"
              icon={iconKA}
            />
            <StatBox
              title="INNLEID"
              value={getCount((e) =>e.form_of_employeement === 'Innleid' && e.is_logged_in)}
              unit="Tilgjengelig"
              icon={iconKA}
            />

            <StatBox
              title="HELTID"
              value={getCount((e) =>e.employee_percentages === 100 && e.is_logged_in)}
              unit="Tilgjengelig"
              icon={iconKA}
            />
            <StatBox
              title="DELTID"
              value={getCount((e) => e.employee_percentages < 100 && e.is_logged_in)}
              unit="Tilgjengelig"
              icon={iconKA}
            />

            <StatBox
              title="FULLTIDSEKVIVALENTER"
              //setter en 100 % stilling = 1
              value={formattedFTE}
              unit="FTE (KA)"
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
