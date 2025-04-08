import React from "react";
import "../../styles/dashboard.css";
import "../../styles/global.css";

const StatBox = ({ title, value, unit, highlight, className, icon }) => {
  return (
    <div
      className={`stat-box ${highlight ? "highlight" : ""} ${className || ""}`}
    >
      <div className="statbox-top">
        <h4>{title}</h4>
      </div>

      <div className="statbox-bottom-row">
        {icon && <img src={icon} alt={`${title} ikon`} className="stat-icon" />}
        <div className="stat-value">
          <div className="value">{value}</div>
          {unit && <div className="unit">{unit}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatBox;
