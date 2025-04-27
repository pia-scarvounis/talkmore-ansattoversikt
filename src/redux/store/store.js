import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "../slices/dateSlice";
import employeeReducer from "../slices/employeeSlice";
import noteReducer from "../slices/noteSlice";
import availableEmployeesReducer from "../slices/availableemployeesSlice";
import dayOverviewEmployeesReducer from '../slices/dayOverviewEmpSlice';
import employeeHistoryReducer from '../slices/historySlice'
export const store = configureStore({
  reducer: {
    date: dateReducer,
    employees: employeeReducer,
    notes: noteReducer,
    employeeHistory: employeeHistoryReducer,
    dayOverviewEmployees: dayOverviewEmployeesReducer,
    availableEmployees: availableEmployeesReducer
  },
});
