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

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeHistory(employeeId));
    }
  }, [employeeId, dispatch]);

  // Definerer kolonnene
  const columns = useMemo(
    () => [
      { accessorKey: "field_changed", header: "Status" },
      { accessorKey: "old_value", header: "Opprinnelig" },
      { accessorKey: "new_value", header: "Oppdatert" },
      { accessorKey: "endret_av_navn", header: "Endret av" },
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
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <div>Laster historikk...</div>;
  if (error) return <div>Feil: {error}</div>;
  if (!data.length) return <div>Ingen historikk funnet.</div>;

  return (
    <div className="history-table-wrapper">
      <div className="history-header">
        <img src={historyIcon} alt="Historikk" className="history-icon" />
        <h2>Historikk</h2>
      </div>
      <div className="history-table-container">
        <table className="history-table">
          <thead
            className={`history-table-header ${
              employeeRole === "Admin" || employeeRole === "Teamleder"
                ? "pink-border"
                : "blue-border"
            }`}
          >
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
