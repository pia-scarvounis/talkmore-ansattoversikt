import React from "react";
import "../../styles/dashboard.css";
import "../../styles/global.css";

const StatBox = ({ title, value, unit, highlight, className }) => {
  return (
    <div
      className={`stat-box ${highlight ? "highlight" : ""} ${className || ""}`}
    >
      {" "}
      <h4>{title}</h4>
      <div className="value">{value}</div>
      {unit && <div className="unit">{unit}</div>}
    </div>
  );
};

export default StatBox;
