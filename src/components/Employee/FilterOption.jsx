import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/optionSection.css";

const FilterOption = ({ employees, onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lokale state for å lagre unike alternativer
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [percentages, setPercentages] = useState([]);

  // State for å lagre brukerens filtervalg
  const [filters, setFilters] = useState({
    formOfEmployment: "", // Fast/Innleid
    position: "", // Stilling
    percentage: "", // Prosent
    department: "", // Avdeling
    fullTime: false, // Heltid checkbox
    partTime: false, // Deltid checkbox
  });

  // Når komponenten laster: hent filtervalg fra URL
  useEffect(() => {
    const initialFilters = {
      formOfEmployment: searchParams.get("form") || "",
      position: searchParams.get("position") || "",
      percentage: searchParams.get("percentage") || "",
      department: searchParams.get("department") || "",
      fullTime: searchParams.get("fullTime") === "true",
      partTime: searchParams.get("partTime") === "true",
    };
    setFilters(initialFilters);
  }, []); // <-- Kun en gang

  useEffect(() => {
    if (employees.length > 0) {
      const uniqueDepartments = [
        ...new Set(employees.map((emp) => emp.department_name)),
      ].filter(Boolean);
      const uniquePositions = [
        ...new Set(employees.map((emp) => emp.workPosistion_title)),
      ].filter(Boolean);
      const uniquePercentages = [
        ...new Set(employees.map((emp) => emp.employee_percentages)),
      ]
        .filter(Boolean)
        .sort((a, b) => b - a);

      setDepartments(uniqueDepartments);
      setPositions(uniquePositions);
      setPercentages(uniquePercentages);
    }
  }, [employees]);

  // Når filtrene endres, send dem tilbake til EmployeeListTemplate
  useEffect(() => {
    onFilterChange(filters);

    // Oppdater URL med de valgte filtrene
    const newParams = new URLSearchParams();

    if (filters.formOfEmployment)
      newParams.set("form", filters.formOfEmployment);
    if (filters.position) newParams.set("position", filters.position);
    if (filters.percentage) newParams.set("percentage", filters.percentage);
    if (filters.fullTime) newParams.set("fullTime", "true");
    if (filters.partTime) newParams.set("partTime", "true");

    setSearchParams(newParams);
  }, [filters, onFilterChange]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "fullTime" && checked) {
        // Hvis "Heltid" velges, fjern kryss på "Deltid"
        setFilters((prevFilters) => ({
          ...prevFilters,
          fullTime: true,
          partTime: false,
        }));
      } else if (name === "partTime" && checked) {
        // Hvis "Deltid" velges, fjern kryss på "Heltid"
        setFilters((prevFilters) => ({
          ...prevFilters,
          fullTime: false,
          partTime: true,
        }));
      } else {
        // Hvis brukeren fjerner kryss på en checkbox
        setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: false,
        }));
      }
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  // Nullstill alle filtre
  const resetFilters = () => {
    // Nullstill valgt filter i state
    setFilters({
      formOfEmployment: "",
      position: "",
      percentage: "",
      department: "",
      fullTime: false,
      partTime: false,
    });

    // Nullstill URL-parametre også
    setSearchParams({});
  };

  // Funksjon for å filtrere ansatte basert på valgt filter
  const getFilteredEmployees = () => {
    return employees.filter((emp) => {
      const matchesForm = filters.formOfEmployment
        ? emp.form_of_employeement === filters.formOfEmployment
        : true;

      const matchesPosition = filters.position
        ? emp.workPosistion_title === filters.position
        : true;

      const matchesPercentage = filters.percentage
        ? String(emp.employee_percentages) === filters.percentage
        : true;

      const matchesDepartment = filters.department
        ? emp.department_name === filters.department
        : true;

      const matchesFullTime = filters.fullTime
        ? emp.employee_percentages === 100
        : true;

      const matchesPartTime = filters.partTime
        ? emp.employee_percentages < 100
        : true;

      return (
        matchesForm &&
        matchesPosition &&
        matchesPercentage &&
        matchesDepartment &&
        matchesFullTime &&
        matchesPartTime
      );
    });
  };

  // Sjekk om noen filtervalg er aktivt
  const isAnyFilterActive = () => {
    return (
      filters.formOfEmployment ||
      filters.position ||
      filters.percentage ||
      filters.department ||
      filters.fullTime ||
      filters.partTime
    );
  };

  return (
    <div className="content-container">
      <div className="filter-wrapper">
        <div className="select-group">
          <select
            name="formOfEmployment"
            value={filters.formOfEmployment}
            onChange={handleChange}
            className="options-section"
          >
            <option value="">Fast eller Innleid</option>
            <option value="Fast">Fast</option>
            <option value="Innleid">Innleid</option>
          </select>

          <select
            name="position"
            value={filters.position}
            onChange={handleChange}
            className="options-section"
          >
            <option value="">Stillingstittel</option>
            {positions.map((position, index) => (
              <option key={index} value={position}>
                {position}
              </option>
            ))}
          </select>

          <select
            name="percentage"
            value={filters.percentage}
            onChange={handleChange}
            className="options-section"
          >
            <option value="">Velg %</option>
            {percentages.map((percentage, index) => (
              <option key={index} value={percentage}>
                {percentage}%
              </option>
            ))}
          </select>
          {isAnyFilterActive() && (
            <button onClick={resetFilters} className="reset-filter-button">
              Nullstill filter
            </button>
          )}
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="fullTime"
              checked={filters.fullTime}
              onChange={handleChange}
              className="checkbox"
            />
            Heltid
          </label>
          <label>
            <input
              type="checkbox"
              name="partTime"
              checked={filters.partTime}
              onChange={handleChange}
              className="checkbox"
            />
            Deltid
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterOption;
