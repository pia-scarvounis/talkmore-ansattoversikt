import React from "react";
import "../../styles/optionSection.css";

const FilterOption = () => {
  return (
    /** Filter option og select box med dummydata*/
    <div className="content-container">
      <div className="filter-wrapper">
        <div className="select-group">
          {/* Dropdown-rad */}
          <select
            value="Fast/Innleid"
            className="options-section" /**value={filters.fixedOrHired} onChange={handleChange}**/
          >
            <option value="">Fast eller innleid</option>
            <option value="fixed">Fast</option>
            <option value="hired">Innleid</option>
          </select>
          <select
            value="Stillingstittel"
            className="options-section" /**value={filters.fixedOrHired} onChange={handleChange}**/
          >
            <option value="">Stillingstittel</option>
            <option value="KA">KA</option>
            <option value="TeamLeader">Teamleder</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            value="Permisjon%"
            className="options-section" /**value={filters.fixedOrHired} onChange={handleChange}**/
          >
            <option value="">Velg %</option>
            <option value="100%">100%</option>
            <option value="90%">90%</option>
            <option value="80%">80%</option>
            <option value="70%">70%</option>
            <option value="60%">60%</option>
            <option value="50%">50%</option>
            <option value="40%">40%</option>
            <option value="30%">30%</option>
            <option value="20%">20%</option>
            <option value="10%">10%</option>
          </select>
        </div>

        {/* Checkbox-rad */}

        <div className="checkbox-group">
          <label>
            <input type="checkbox" name="Heltid" className="checkbox" />
            Heltid
          </label>
          <label>
            <input type="checkbox" name="Deltid" className="checkbox" />
            Deltid
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterOption;
