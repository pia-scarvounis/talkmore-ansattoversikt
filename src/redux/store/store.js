import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "../slices/dateSlice";
import employeeReducer from "../slices/employeeSlice";
import noteReducer from "../slices/noteSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    employees: employeeReducer,
    notes: noteReducer,
    availableEmployees: availableEmployeesReducer
  },
});
