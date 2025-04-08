import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import "../../styles/dashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { setDate } from "../../redux/slices/dateSlice";

const DateSelector = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.date.selectedDate);
  return (
    <div className="date-selector">
      <DatePicker
        selected={new Date(selectedDate)}
        onChange={(date) => dispatch(setDate(date))}
        dateFormat="dd.MM.yyyy"
        className="custom-datepicker"
      />
      <img src={calendarIcon} alt="Kalenderikon" className="calendar-icon" />
    </div>
  );
};

export default DateSelector;
