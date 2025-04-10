import React from "react";
import NavAdmin from "../components/navigation/NavAdmin";
import StatBox from "../components/Dashboard/StatBox";
import EventBox from "../components/Dashboard/EventBox";
import "../styles/dashboard.css";
import iconKSAdmin from "../assets/icons/ks-admin.svg";
import iconKA from "../assets/icons/ka.svg";
import iconFTE from "../assets/icons/fte.svg";
import iconTL from "../assets/icons/tl.svg";
import DateSelector from "../components/Dashboard/DateSelector";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

const DashboardAdmin = () => {
  const selectedDate = useSelector((state) => state.date.selectedDate);
  const formattedDate = format(new Date(selectedDate), "EEEE d. MMMM yyyy", {
    locale: nb,
  });

  return (
    <div className="dashboard-layout">
      <NavAdmin />

      <div className="dashboard-wrapper">
        <div className="left-column">
          <div className="dashboard-header">
            {/* <h1>Dagsoversikt</h1> */}
            <p className="date-label">{formattedDate}</p>
            <DateSelector />
          </div>
          <div className="dashboard-grid">
            <StatBox
              title="TEAMLEDERE"
              value={6}
              unit="Tilgjengelig"
              icon={iconTL}
            />
            <StatBox
              title="KS ADMIN"
              value={7}
              unit="Tilgjengelig"
              icon={iconKSAdmin}
            />
            <StatBox
              title="KUNDEANSVARLIG"
              value={40}
              unit="Tilgjengelig"
              icon={iconKA}
            />

            <StatBox
              title="TELENORANSATTE"
              value={35}
              unit="Tilgjengelig"
              icon={iconKA}
            />
            <StatBox
              title="INNLEID"
              value={5}
              unit="Tilgjengelig"
              icon={iconKA}
            />

            <StatBox
              title="HELTID"
              value={35}
              unit="Tilgjengelig"
              icon={iconKA}
            />
            <StatBox
              title="DELTID"
              value={5}
              unit="Tilgjengelig"
              icon={iconKA}
            />

            <StatBox
              title="FULLTIDSEKVIVALENTER"
              value="37,5"
              unit="FTE (KA)"
              highlight
              className="fte"
              icon={iconFTE}
            />
          </div>
        </div>

        <div className="right-column">
          <EventBox />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
