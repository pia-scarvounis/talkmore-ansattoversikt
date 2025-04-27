import React from "react";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import "../../styles/dashboard.css";
import balloonsIcon from "../../assets/icons/balloons.svg";

const EventBox = () => {
  const { data: employees, loading } = useSelector((state) => state.employees);
  const selectedDateString = useSelector((state) => state.date.selectedDate);
  const today = new Date(selectedDateString);
  console.log("Employees i EventBox:", employees);

  // Hent dagens dato
  const todayDay = today.getUTCDate();
  const todayMonth = today.getUTCMonth() + 1;
  const todayYear = today.getUTCFullYear();

  // Hent ansatte som har bursdag i dag
  const birthdayEmployees = employees.filter((emp) => {
    if (!emp.birthdate) return false;
    const birthDate = parseISO(emp.birthdate);
    const birthDay = birthDate.getUTCDate();
    const birthMonth = birthDate.getUTCMonth() + 1;
    return birthDay === todayDay && birthMonth === todayMonth;
  });

  // Hent ansatte som har jubileum i dag
  const jubileeEmployees = employees.filter((emp) => {
    if (!emp.start_date) return false;
    const hireDate = parseISO(emp.start_date);
    const hireDay = hireDate.getUTCDate();
    const hireMonth = hireDate.getUTCMonth() + 1;
    return (
      hireDay === todayDay &&
      hireMonth === todayMonth &&
      todayYear - hireDate.getUTCFullYear()
    );
  });

  if (loading) {
    return (
      <div className="event-box">
        <h3>
          <span className="icon-balloons">
            <img src={balloonsIcon} alt="Ballonger" />
          </span>{" "}
          BURSDAGER & JUBILEUM
        </h3>
        <p>Laster inn bursdager og jubileer...</p>
      </div>
    );
  }

  // Når loading er ferdig, vis dataen:
  return (
    <div className="event-box">
      <h3>
        <span className="icon-balloons">
          <img src={balloonsIcon} alt="Ballonger" />
        </span>{" "}
        BURSDAGER & JUBILEUM
      </h3>

      <div className="section-title">Bursdag i dag</div>
      {birthdayEmployees.length > 0 ? (
        birthdayEmployees.map((emp) => (
          <div key={emp.employee_id} className="entry">
            <span>🎂 {emp.employee_name} har bursdag i dag</span>
          </div>
        ))
      ) : (
        <div className="entry">
          <span>Ingen bursdager i dag</span>
        </div>
      )}

      <div className="section-title">Jubileum i dag</div>
      {jubileeEmployees.length > 0 ? (
        jubileeEmployees.map((emp) => {
          const hireDate = parseISO(emp.start_date);
          const years = todayYear - hireDate.getFullYear();
          return (
            <div key={emp.employee_id} className="entry">
              <span>
                🎉
                {emp.employee_name} har {years}-års jubileum i dag
              </span>
            </div>
          );
        })
      ) : (
        <div className="entry">
          <span>Ingen jubileum i dag</span>
        </div>
      )}
    </div>
  );
};
export default EventBox;
