import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/listview.css";
import "../../styles/profilecards.css";
import "../../styles/buttons.css";

const ListView = ({ employees, loading, error }) => {
  const navigate = useNavigate();

  if (!Array.isArray(employees)) return <p>Ingen ansatte å vise</p>;
  if (loading) return <p>Laster inn ansatte...</p>;
  if (error) return <p>Feil: {error}</p>;

  return (
    <div className="profile-list">
      {employees.map((emp) => {
        const isPink =
          emp.workPosistion_title === "Admin" ||
          emp.workPosistion_title === "Teamleder";

        const borderClass = isPink ? "pink-border" : "blue-border";

        return (
          <div
            key={emp.employee_id}
            className={`profile-list-item ${borderClass}`}
          >
            <div className="profile-list-info">
              <p>
                <span className="label-info">Navn:</span> {emp.employee_name}
              </p>
              <p>
                <span className="label-info">Stilling:</span>{" "}
                {emp.workPosistion_title}
              </p>
              <p>
                <span className="label-info">Team:</span> {emp.team_name}
              </p>
              <p>
                <span className="label-info">Prosent:</span>{" "}
                {emp.employee_percentages}%
              </p>
              <p>
                <span className="label-info">E-post:</span> {emp.epost}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListView;
