// src/components/Employee/EmployeeHistoryTable.jsx
/** 
import React, { useEffect, useMemo } from "react";
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

  // Flat ut historikken i én rad per faktisk endret felt
  const flattenedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.flatMap((entry) => {
      const changes = [];

      // Permisjon
      if (entry.leave_percentage) {
        changes.push({
          ...entry,
          status: "Ny permisjon",
          permisjon: `${entry.leave_percentage}%`,
          start_date: entry.leave_start_date,
          end_date: entry.leave_end_date,
          team_name: "",
          employeeNr_Telenor: "",
          workPosistion_title: "",
        });
      }

      // Stillingsprosent
      if (entry.employee_percentages) {
        changes.push({
          ...entry,
          status: "stilling %",
          permisjon: `${entry.employee_percentages}%`,
          start_date: entry.start_date,
          end_date: entry.end_date,
          team_name: "",
          employeeNr_Telenor: "",
          workPosistion_title: "",
        });
      }

      // Nytt ansattnummer
      if (entry.employeeNr_Telenor) {
        changes.push({
          ...entry,
          status: "Ny Ansattnr ( Telenor )",
          start_date: entry.start_date,
          end_date: entry.end_date,
          permisjon: "",
          team_name: "",
          workPosistion_title: "",
        });
      }

      // Endret team
      if (entry.team_name) {
        changes.push({
          ...entry,
          status: "Endret Team",
          start_date: entry.start_date,
          end_date: entry.end_date,
          permisjon: "",
          employeeNr_Telenor: "",
          workPosistion_title: "",
        });
      }

      // Endret stilling
      if (entry.workPosistion_title) {
        changes.push({
          ...entry,
          status: "Stilling/Rolle",
          start_date: entry.start_date,
          end_date: entry.end_date,
          permisjon: "",
          employeeNr_Telenor: "",
          team_name: "",
        });
      }

      // Sluttet
      if (
        entry.end_date &&
        !entry.leave_percentage &&
        !entry.workPosistion_title &&
        !entry.team_name &&
        !entry.employeeNr_Telenor
      ) {
        changes.push({
          ...entry,
          status: "Ansatt sluttet",
          start_date: entry.start_date,
          end_date: entry.end_date,
          permisjon: "",
          employeeNr_Telenor: "",
          workPosistion_title: "",
          team_name: "",
        });
      }

      return changes;
    });
  }, [data]);

  const columns = [
    {
      header: "Start dato",
      accessorKey: "start_date",
      cell: (info) => {
        const endDate = info.row.original.end_date;
        const startDate = info.getValue()?.split("T")[0];
        return endDate ? startDate : "";
      },
    },

    {
      header: "Slutt dato",
      accessorKey: "end_date",
      cell: (info) => info.getValue()?.split("T")[0] || "",
    },
    {
      header: "Status",
      accessorKey: "status",
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
      accessorKey: "permisjon",
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
      cell: (info) => info.getValue()?.split("T")[0] || "",
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
    data: flattenedData,
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
*/

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeHistory } from "../../redux/slices/historySlice";

const EmployeeHistoryTable = ({ employeeId }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.employeeHistory);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeHistory(employeeId));
    }
  }, [employeeId, dispatch]);

  if (loading) return <div>Laster historikk...</div>;
  if (error) return <div>Feil: {error}</div>;
  if (!data.length) return <div>Ingen historikk funnet.</div>;

  return (
    <div className="form-section history-table-wrapper">
      <h2 className="section-heading">Endringshistorikk</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Felt</th>
            <th>Gammel verdi</th>
            <th>Ny verdi</th>
            <th>Endret av</th>
            <th>Dato</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.changeLog_id}>
              <td>{entry.field_changed}</td>
              <td>{entry.old_value}</td>
              <td>{entry.new_value}</td>
              <td>{entry.endret_av_navn}</td>
              <td>{entry.change_date?.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeHistoryTable;