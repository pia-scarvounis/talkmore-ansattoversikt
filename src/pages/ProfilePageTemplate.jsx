// ProfilePageTemplate.jsx – felles mal for profilsider

import React, { useState, useEffect } from "react";
import PageHeader from "../components/UI/PageHeader";
import DateCount from "../components/UI/DateCount";
import NavAdmin from "../components/navigation/NavAdmin";
import ProfileCards from "../components/Employee/ProfileCards";
import FilterOption from "../components/Employee/FilterOption"; // standard filter

/**
 * Denne komponenten er en mal for alle profilsidene (Teamleder, Kundeansvarlig, osv.)
 *
 * Props:
 * - title: Tittel som vises i PageHeader
 * - showStandardFilter: Vis standardfilter (FilterOption.jsx)
 * - CustomFilterComponent: (valgfri) Send inn en annen filter-komponent dersom siden har egne filtre
 * - data: Liste over ansatte (bruk dummydata nå – byttes med redux senere)
 */

const ProfilePageTemplate = ({
  title,
  showStandardFilter = false,
  CustomFilterComponent = null,
  data = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // søkelogikk
  useEffect(() => {
    if (!data) return;

    const filtered = data.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  return (
    <div>
      {/* header med søkefelt og dato/antall */}
      <div className="page-header-wrapper">
        <PageHeader title={title} showSearch={true} onSearch={setSearchTerm} />
        <DateCount count={filteredData.length} />
      </div>

      {/* filtrering */}
      {showStandardFilter && <FilterOption />}
      {CustomFilterComponent && <CustomFilterComponent />}

      {/* hovedinnhold: Navigasjon + liste med kort */}
      <div className="profilePages-container">
        <NavAdmin />

        <div className="profileList-container">
          {filteredData.map((employee, index) => (
            <ProfileCards key={index} employee={employee} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageTemplate;

