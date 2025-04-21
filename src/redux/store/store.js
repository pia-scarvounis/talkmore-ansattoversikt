import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "../slices/dateSlice";
import employeeReducer from '../slices/employeeSlice';

export const store = configureStore({
  reducer: {
    date: dateReducer,
    employees: employeeReducer,
  },
});
