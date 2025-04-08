import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import "../../styles/dashboard.css";

const DateSelector = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="date-selector">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd.MM.yyyy"
        className="custom-datepicker"
      />
      <img src={calendarIcon} alt="Kalenderikon" className="calendar-icon" />
    </div>
  );
};

export default DateSelector;
