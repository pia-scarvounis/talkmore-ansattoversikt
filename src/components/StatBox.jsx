import React from "react";
import "../styles/statbox.css";
import "../styles/global.css";

const StatBox = ({ title, value, unit, highlight }) => {
  return (
    <div className={`stat-box ${highlight ? "highlight" : ""}`}>
      <h4>{title}</h4>
      <div className="value">{value}</div>
      {unit && <div className="unit">{unit}</div>}
    </div>
  );
};

export default StatBox;
