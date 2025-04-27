//  felles mal for alle profilkortsider

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import PageHeader from "../UI/PageHeader";
import DateCount from "../UI/DateCount";
import NavAdmin from "../navigation/NavAdmin";
import ProfileCards from "./ProfileCards";
import FilterOption from "./FilterOption";
import WhiteButton from "../UI/WhiteButton";

/**
 * Denne komponenten brukes som mal for alle profilsider (f.eks. Brooklyn, Privat, Kundeansvarlig)
 *
 * Props:
 * - title: Tittel som vises i PageHeader
 * - showStandardFilter: Hvis true vises FilterOption-komponenten
 * - CustomFilterComponent: (valgfri) for egne filter-komponenter (f.eks. FTE-graf senere)
 * - data: Liste over ansatte
 * - loading: true hvis vi venter på API-svar
 * - error: melding hvis API-et feiler
 */

const EmployeeListTemplate = ({
  title,
  showStandardFilter = false,
  CustomFilterComponent = null,
  showDate = true,
}) => {
  const dispatch = useDispatch();
  const {
    data: employees,
    loading,
    error,
  } = useSelector((state) => state.employees);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    formOfEmployment: "",
    position: "",
    percentage: "",
    department: "",
    fullTime: false,
    partTime: false,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Søkelogikk
  // Endret useEffect som håndterer søk + filter
  useEffect(() => {
    if (!employees || !Array.isArray(employees)) return;

    const term = searchTerm.toLowerCase();

    const filtered = employees.filter((employee) => {
      const matchesSearch =
        employee.employee_name?.toLowerCase().includes(term) ||
        employee.epost?.toLowerCase().includes(term) ||
        employee.form_of_employeement?.toLowerCase().includes(term) ||
        employee.workPosistion_title?.toLowerCase().includes(term) ||
        employee.team_name?.toLowerCase().includes(term) ||
        employee.employeeNr_Talkmore?.toString().includes(term) ||
        employee.employeeNr_Telenor?.toString().includes(term) ||
        (employee.is_on_leave && "permisjon".includes(term));

      const matchesForm = selectedFilters.formOfEmployment
        ? employee.form_of_employeement === selectedFilters.formOfEmployment
        : true;

      const matchesPosition = selectedFilters.position
        ? employee.workPosistion_title === selectedFilters.position
        : true;

      const matchesPercentage = selectedFilters.percentage
        ? String(employee.employee_percentages) === selectedFilters.percentage
        : true;

      const matchesDepartment = selectedFilters.department
        ? employee.department_name === selectedFilters.department
        : true;

      const matchesFullTime = selectedFilters.fullTime
        ? employee.employee_percentages === 100
        : true;

      const matchesPartTime = selectedFilters.partTime
        ? employee.employee_percentages < 100
        : true;

      return (
        matchesSearch &&
        matchesForm &&
        matchesPosition &&
        matchesPercentage &&
        matchesDepartment &&
        matchesFullTime &&
        matchesPartTime
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, employees, selectedFilters]);

  const visibleData = showAll ? filteredData : filteredData.slice(0, 9);

  // Lasting og feil vises før resten
  if (loading) return <p>Laster inn ansatte...</p>;
  if (error) return <p>Feil: {error}</p>;

  return (
    <div>
      {/* Header med søkefelt og dato/antall */}
      <div className="page-header-wrapper">
        <PageHeader title={title} showSearch={true} onSearch={setSearchTerm} />
        <DateCount count={filteredData.length} hideDate={!showDate} />
      </div>

      {/* Filtrering */}
      {showStandardFilter && (
        <FilterOption
          employees={employees}
          onFilterChange={setSelectedFilters}
        />
      )}
      {CustomFilterComponent && <CustomFilterComponent />}

      {/* Navigasjon og profilkort */}
      <div className="profilePages-container">
        <NavAdmin />
        <div className="profileList-container">
          <ProfileCards
            employees={visibleData}
            loading={loading}
            error={error}
          />
          {!loading && !error && visibleData.length === 0 && (
            <p className="no-results-message">Ingen ansatte å vise.</p>
          )}

          {/* Last flere / Vis færre knapp */}
          <div className="load-more-wrap">
            {filteredData.length > 9 && visibleData.length > 0 ? (
              <WhiteButton
                text={showAll ? "Vis færre" : "Last flere"}
                onClick={() => setShowAll(!showAll)}
              />
            ) : (
              <div className="button-placeholder" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListTemplate;
