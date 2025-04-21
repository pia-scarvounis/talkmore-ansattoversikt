// src/pages/ProfilePageTemplate.jsx – felles mal for profilsider

import React, { useState, useEffect } from "react";
import PageHeader from "../components/UI/PageHeader";
import DateCount from "../components/UI/DateCount";
import NavAdmin from "../components/navigation/NavAdmin";
import ProfileCards from "../components/Employee/ProfileCards";
import FilterOption from "../components/Employee/FilterOption";

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

const ProfilePageTemplate = ({
  title,
  showStandardFilter = false,
  CustomFilterComponent = null,
  data = [],
  loading = false,
  error = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Søkelogikk basert på navn
  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    const filtered = data.filter((employee) =>
      employee.employee_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

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
        <DateCount count={filteredData.length} />
      </div>

      {/* Filtrering */}
      {showStandardFilter && <FilterOption />}
      {CustomFilterComponent && <CustomFilterComponent />}

      {/* Navigasjon og profilkort */}
      <div className="profilePages-container">
        <NavAdmin />
        <div className="profileList-container">
        {filteredData.map((employee, index) => (
 <ProfileCards
 employees={filteredData}
 loading={loading}
 error={error}
/>



))}

        </div>
      </div>
    </div>
  );
};

export default ProfilePageTemplate;


