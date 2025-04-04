import React from "react";
import NavAdmin from "../components/navigation/NavAdmin";
import StatBox from "../components/StatBox";
import "../styles/dashboard.css";

const DashboardAdmin = () => {
  return (
    <div className="dashboard-layout">
      <NavAdmin />

      <div className="dashboard-wrapper">
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
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
