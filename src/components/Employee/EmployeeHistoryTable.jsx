// src/components/Employee/EmployeeHistoryTable.jsx
import React, { useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeHistory } from "../../redux/slices/historySlice";
import "../../styles/historyTable.css";

import historyIcon from "../../assets/icons/history.svg";
import editIcon from "../../assets/icons/edit.svg";

const EmployeeHistoryTable = ({ employeeId }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.employeeHistory
  );

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeHistory(employeeId));
    }
  }, [employeeId, dispatch]);

  const columns = [
    {
      header: "Start dato",
      accessorKey: "start_date",
      cell: (info) => info.getValue()?.split("T")[0],
    },
    {
      header: "Slutt dato",
      accessorKey: "end_date",
      cell: (info) => info.getValue()?.split("T")[0],
    },
    {
      header: "Status",
      accessorKey: "form_of_employeement",
    },
    {
      header: "Team",
      accessorKey: "team_name",
    },
    {
      header: "Ansattnr",
      accessorKey: "employeeNr_Telenor",
    },
    {
      header: "Permisjon",
      accessorKey: "leave_percentage",
      cell: (info) => (info.getValue() ? `${info.getValue()}%` : ""),
    },
    {
      header: "Stilling",
      accessorKey: "workPosistion_title",
    },
    {
      header: "Endret av",
      accessorKey: "endret_av_navn",
    },
    {
      header: "Dato",
      accessorKey: "change_date",
      cell: (info) => info.getValue()?.split("T")[0],
    },
    {
      header: "Endre",
      cell: () => (
        <img
          src={editIcon}
          alt="Rediger"
          title="Rediger"
          className="icon-button"
        />
      ),
    },
  ];

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <div>Laster historikk...</div>;
  if (error) return <div>Feil: {error}</div>;

  return (
    <div className="form-section history-table-wrapper">
      <div className="history-header">
        <img src={historyIcon} alt="Historikk" className="history-icon" />
        <h2 className="section-heading">Historikk</h2>
      </div>
      <table className="history-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
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
  );
};

export default EmployeeHistoryTable;
