import React from "react";
import NavAdmin from "../components/navigation/NavAdmin";
import StatBox from "../components/Dashboard/StatBox";
import EventBox from "../components/Dashboard/EventBox";
import "../styles/dashboard.css";

const DashboardAdmin = () => {
  return (
    <div className="dashboard-layout">
      <NavAdmin />

      <div className="dashboard-wrapper">
        <div className="left-column">
          <h1>Dagsoversikt</h1>

          <div className="dashboard-grid">
            <StatBox title="TEAMLEDERE" value={6} />
            <StatBox title="KS ADMIN" value={7} />
            <StatBox title="KUNDEANSVARLIG" value={40} />

            <StatBox title="TELENORANSATTE" value={35} />
            <StatBox title="INNLEID" value={5} />

            <StatBox title="HELTID" value={35} />
            <StatBox title="DELTID" value={5} />

            <StatBox
              title="FULLTIDSEKVIVALENTER"
              value="37,5"
              unit="FTE (KA)"
              highlight
              className="fte"
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
