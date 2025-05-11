import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { fetchEmployeeHistory } from "../../redux/slices/historySlice";
import editIcon from "../../assets/icons/edit.svg";
import historyIcon from "../../assets/icons/history.svg";
import "../../styles/historyTable.css";

const EmployeeHistoryTable = ({ employeeId, employeeRole }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.employeeHistory
  );

  // Henter den innloggede brukeren (forutsatt at den ligger i Redux)
  const loggedInUser = useSelector(
    (state) => state.user?.name || "Ukjent Bruker"
  );

  // Henter historikk for ansatt ved lasting av komponenten
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeHistory(employeeId));
    }
  }, [employeeId, dispatch]);

  // Funksjon for å vise beskrivende navn på feltene som er endret
  const getFieldDescription = (fieldName) => {
    const fieldDescriptions = {
      employeeNr_Talkmore: "Ansattnummer (Talkmore)",
      employeeNr_Telenor: "Ansattnummer (Telenor)",
      team_id: "Team",
      team_name: "Team Navn",
      workPosistion_id: "Stillingstittel",
      workPosistion_title: "Stillingstittel",
      form_of_employeement: "Ansettelsesform",
      employee_percentages: "Stillingsprosent",
      start_date: "Startdato",
      end_date: "Sluttdato",
      leave_id: "Permisjon ID",
      leave_percentage: "Permisjonsprosent",
      leave_start_date: "Permisjon Startdato",
      leave_end_date: "Permisjon Sluttdato",
      leave: "Permisjon",
    };

    return fieldDescriptions[fieldName] || fieldName;
  };

  // Definerer kolonnene for tabellen
  const columns = useMemo(
    () => [
      {
        accessorKey: "field_changed",
        header: "Status",
        cell: ({ getValue }) => getFieldDescription(getValue()),
      },
      {
        accessorKey: "old_value",
        header: "Opprinnelig",
        cell: ({ getValue }) =>
          getValue() === "NULL" || getValue() === null ? "" : getValue(),
      },
      {
        accessorKey: "new_value",
        header: "Oppdatert",
        cell: ({ getValue }) =>
          getValue() === "NULL" || getValue() === null ? "" : getValue(),
      },
      {
        accessorKey: "endret_av_navn",
        header: "Endret av",
        // Viser den innloggede brukeren hvis "endret_av_navn" ikke finnes
        cell: ({ getValue }) => getValue() || loggedInUser,
      },
      {
        accessorKey: "change_date",
        header: "Dato for Endring",
        cell: ({ getValue }) => {
          const date = getValue()?.split("T")[0];
          return date || "Ukjent";
        },
      },
      {
        header: "Rediger",
        cell: () => <img src={editIcon} alt="Rediger" className="edit-icon" />,
      },
    ],
    [loggedInUser] // Avhenger av den innloggede brukeren
  );

  // Oppsett av tabellen med React Table
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Håndterer lastestatus og feilmeldinger
  if (loading) return <div>Laster historikk...</div>;
  if (error) return <div>Feil: {error}</div>;
  if (!data.length) return <div>Ingen historikk funnet.</div>;

  return (
    <div className="history-table-wrapper">
      {/* Header for historikk */}
      <div className="history-header">
        <img src={historyIcon} alt="Historikk" className="history-icon" />
        <h2>Historikk</h2>
      </div>

      {/* Selve tabellen */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              {table
                .getHeaderGroups()
                .map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))
                )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeHistoryTable;
