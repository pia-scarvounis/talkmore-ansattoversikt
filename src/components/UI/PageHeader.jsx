import React from "react";
import BackButton from "./BackButton";

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

const PageHeader = ({ title }) => {
  return (
    <div className="page-header">
      <BackButton />
      <h1>{title}</h1>
    </div>
  );
};

export default PageHeader;


