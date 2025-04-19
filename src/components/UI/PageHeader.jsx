import React from "react";
import BackButton from "./BackButton";
import SearchField from "../Filters/SearchField";

/**
 * PageHeader-komponenten viser en overskrift (h1) med en tilbakeknapp til venstre.
 * Brukes på toppen av alle sider som trenger en heading og navigasjon tilbake.
 *
 * Eksempel:
 * <PageHeader title="Rediger ansatt" />
 *
 * Styling gjøres via global.css:
 * - Wrapper: .page-header (rad med flex)
 * - Posisjonering: Legg komponenten inni en div med klassen .page-header-wrapper for jevn plassering på alle sider
 */

// <div className="page-header-wrapper">
//   <PageHeader
//     title="Alle ansatte"
//     showSearch={true}
//     onSearch={setSearchTerm}
//   />
// </div>; - Slik skal det se ut når vi skal bruke søkebaren på sidene.

const PageHeader = ({ title, onSearch, showSearch = false }) => {
  return (
    <div className="page-header">
      <div className="page-header-top-row">
        <BackButton />
        {showSearch && (
          <div className="page-header-search">
            <SearchField onSearch={onSearch} />
          </div>
        )}
      </div>
      <h1 className="page-header-title">{title}</h1>
    </div>
  );
};

export default PageHeader;
