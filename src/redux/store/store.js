import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "../slices/dateSlice";
import employeeReducer from "../slices/employeeSlice";
import noteReducer from "../slices/noteSlice";
import availableEmployeesReducer from "../slices/availableemployeesSlice";
import dayOverviewEmployeesReducer from '../slices/dayOverviewEmpSlice';
export const store = configureStore({
  reducer: {
    date: dateReducer,
    employees: employeeReducer,
    notes: noteReducer,
    dayOverviewEmployees: dayOverviewEmployeesReducer,
    availableEmployees: availableEmployeesReducer
  },
});
