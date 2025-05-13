import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import { fetchEmployeeHistory } from "../../redux/slices/historySlice";
import editIcon from "../../assets/icons/edit.svg";
import historyIcon from "../../assets/icons/history.svg";
import "../../styles/historyTable.css";
import EditHistoryPopup from "../History/EditHistoryPopup";
import { updateChangeLog } from "../../redux/slices/AdminSlices/adminHistoryCrudSlice";

const EmployeeHistoryTable = ({ employeeId, employeeRole }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.employeeHistory
  );

  // Henter den innloggede brukeren
  const loggedInUser = useSelector(
    (state) => state.user?.name || "Ukjent Bruker"
  );

  // Henter team og stillinger fra Redux
  const teams = useSelector((state) => state.metaData.teams);
  const positions = useSelector((state) => state.metaData.posistions);

  // State for popup
  const [editPopup, setEditPopup] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

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

  // Åpner redigerings-popupen
  const handleEdit = (history) => {
    setSelectedHistory(history);
    setEditPopup(true);
  };

  // Håndterer lagring av redigert historikk
  const saveEdit = async (updatedData) => {
    try {
      const result = await dispatch(
        updateChangeLog({
          changeLogId: selectedHistory.changeLog_id,
          updatedFields: updatedData,
        })
      );
      if ((result, meta.requestStatus === "fulfilled")) {
        dispatch(fetchEmployeeHistory(employeeId)); // Oppdaterer historikken
        setEditPopup(false);
      } else {
        console.error("oppdatering feilet", result.payload);
      }
    } catch (error) {
      console.error("Feil ved lagring av historikk", error);
    }
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
        cell: ({ row, getValue }) => {
          const field = row.original.field_changed;
          const value = getValue();

          if (field === "team_id") {
            const team = teams?.find((t) => t.team_id.toString() === value);
            return team ? team.team_name : value;
          }

          return value === "NULL" || value === null ? "" : value;
        },
      },
      {
        accessorKey: "new_value",
        header: "Oppdatert",
        cell: ({ row, getValue }) => {
          const field = row.original.field_changed;
          const value = getValue();

          if (field === "team_id") {
            const team = teams?.find((t) => t.team_id.toString() === value);
            return team ? team.team_name : value;
          }

          return value === "NULL" || value === null ? "" : value;
        },
      },
      {
        accessorKey: "endret_av_navn",
        header: "Endret av",
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
        cell: ({ row }) => (
          <img
            src={editIcon}
            alt="Rediger"
            className="edit-icon"
            onClick={() => handleEdit(row.original)}
            style={{ cursor: "pointer" }}
          />
        ),
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
  return (
    <div className="history-table-wrapper">
      {/* Header for historikk */}
      <div className="history-header">
        <img src={historyIcon} alt="Historikk" className="history-icon" />
        <h2>Historikk</h2>
      </div>

      {/* Selve tabellen eller melding om ingen historikk */}
      <div className="history-table-container">
        {loading ? (
          <div>Laster historikk...</div>
        ) : error ? (
          <div>Feil: {error}</div>
        ) : (
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
              {data?.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="no-history-text">
                    Ingen historikk funnet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Popup for redigering */}
      {editPopup && (
        <EditHistoryPopup
          history={selectedHistory}
          type={selectedHistory?.field_changed}
          teams={teams}
          positions={positions}
          onClose={() => setEditPopup(false)}
          onSave={() => dispatch(fetchEmployeeHistory(employeeId))}
        />
      )}
    </div>
  );
};

export default EmployeeHistoryTable;
