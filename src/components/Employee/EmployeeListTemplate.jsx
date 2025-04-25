// src/pages/ProfilePageTemplate.jsx – felles mal for profilsider

import React, { useState, useEffect } from "react";
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
  data = [],
  loading = false,
  error = null,
  showDate = true
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Søkelogikk 
  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    const filtered = data.filter((employee) => {
      const term = searchTerm.toLowerCase();
      
      return (
        employee.employee_name?.toLowerCase().includes(term) ||
        employee.epost?.toLowerCase().includes(term) ||
        employee.form_of_employeement?.toLowerCase().includes(term) ||
        employee.workPosistion_title?.toLowerCase().includes(term) ||
        employee.team_name?.toLowerCase().includes(term) ||
        employee.employeeNr_Talkmore?.toString().includes(term) ||
        employee.employeeNr_Telenor?.toString().includes(term) ||
        (employee.is_on_leave && "permisjon".includes(term))
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]);
  const visibleData = showAll ? filteredData : filteredData.slice(0, 9);

  // Lasting og feil vises før resten
  if (loading) return <p>Laster inn ansatte...</p>;
  if (error) return <p>Feil: {error}</p>;

  return (
    <div>
      {/* Header med søkefelt og dato/antall */}
      <div className="page-header-wrapper">
        <PageHeader
          title={title}
          showSearch={true}
          onSearch={setSearchTerm}
        />
        <DateCount count={filteredData.length} hideDate={!showDate} />
      </div>

      {/* Filtrering */}
      {showStandardFilter && <FilterOption />}
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


