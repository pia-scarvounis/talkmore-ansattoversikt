//  felles mal for alle profilkortsider

import React, { useState, useEffect } from "react";
import PageHeader from "../UI/PageHeader";
import DateCount from "../UI/DateCount";
import NavAdmin from "../navigation/NavAdmin";
import ListView from "./ListView";
import ProfileCards from "./ProfileCards";
import FilterOption from "./FilterOption";
import WhiteButton from "../UI/WhiteButton";
import ExportCSVButton from "./ExportCSVButton";
import "../../styles/listview.css";
import ListIcon from "../../assets/icons/list.svg";

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
  data,
  loading,
  error,
}) => {
  // const dispatch = useDispatch();
  // const {
  // data: employees,
  // loading,
  // error,
  // } = useSelector((state) => state.employees);

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
  const [viewMode, setViewMode] = useState("cards"); // "cards" eller "list"

  //  useEffect(() => {
  // dispatch(fetchEmployees());
  // }, [dispatch]);

  // Søkelogikk
  // Endret useEffect som håndterer søk + filter
  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    const term = searchTerm.toLowerCase();

    const filtered = data.filter((employee) => {
      const matchesSearch =
        employee.employee_name?.toLowerCase().includes(term) ||
        employee.epost?.toLowerCase().includes(term) ||
        employee.epost_Telenor?.toLowerCase().includes(term) ||
        employee.employeeNr_Talkmore?.toString().includes(term) ||
        employee.employeeNr_Telenor?.toString().includes(term)

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
  }, [searchTerm, data, selectedFilters]);

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
        <>
          <FilterOption employees={data} onFilterChange={setSelectedFilters} />

          <div className="view-toggle-below">
          {filteredData.length > 0 && (
            <button
              onClick={() =>
                setViewMode(viewMode === "cards" ? "list" : "cards")
              }
              className="view-toggle-button"
            >
        {viewMode === "cards" && (
  <img src={ListIcon} alt="Vis som liste" className="view-icon" />
)}{viewMode === "cards" ? "Vis som liste" : "Vis som kort"}

          
            </button> )}
            {viewMode === "list" && <ExportCSVButton />}{" "}
          
          </div>
        </>
      )}

      {/* Navigasjon og profilkort */}
      <div className="profilePages-container">
        <NavAdmin />
        <div className="profileList-container">
          {viewMode === "cards" ? (
            <ProfileCards
              employees={visibleData}
              loading={loading}
              error={error}
            />
          ) : (
            <ListView employees={visibleData} loading={loading} error={error} />
          )}

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
