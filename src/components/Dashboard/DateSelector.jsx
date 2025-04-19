import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import "../../styles/dashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { setDate } from "../../redux/slices/dateSlice";
import { registerLocale } from "react-datepicker";
import { nb } from "date-fns/locale";

registerLocale("nb", nb);
const DateSelector = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.date.selectedDate);

  const datepickerRef = useRef(null);

  const handleIconClick = () => {
    if (datepickerRef.current) {
      datepickerRef.current.setOpen(true);
    }
  };
  return (
    <div className="date-selector">
      <DatePicker
        ref={datepickerRef}
        selected={new Date(selectedDate)}
        onChange={(date) => dispatch(setDate(date))}
        dateFormat="dd.MM.yyyy"
        className="custom-datepicker"
        locale="nb"
      />
      <img
        src={calendarIcon}
        alt="Kalenderikon"
        className="calendar-icon"
        onClick={handleIconClick}
      />
    </div>
  );
};

export default DateSelector;
