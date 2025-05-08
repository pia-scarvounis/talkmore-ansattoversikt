import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "../slices/dateSlice";
import employeeReducer from "../slices/employeeSlice";
import noteReducer from "../slices/noteSlice";
import availableEmployeesReducer from "../slices/availableemployeesSlice";
import dayOverviewEmployeesReducer from '../slices/dayOverviewEmpSlice';
import employeeHistoryReducer from '../slices/historySlice';
import updateEmployeeReducer from '../slices/AdminSlices/adminEmpl_CrudsSlice';
import adminUpdateHistoryReducer from '../slices/AdminSlices/adminHistoryCrudSlice';
import metaDataReducer from '../slices/metaDataCrudsSlice';
import adminTeamCrudsReducer from '../slices/AdminSlices/adminTeamCruds';
import authReducer from '../slices/authLoginSlice/loginSlice';

export const store = configureStore({
  reducer: {
    date: dateReducer,
    employees: employeeReducer,
    updateEmployee:updateEmployeeReducer,
    notes: noteReducer,
    employeeHistory: employeeHistoryReducer,
    dayOverviewEmployees: dayOverviewEmployeesReducer,
    availableEmployees: availableEmployeesReducer,
    changeLog: adminUpdateHistoryReducer,
    metaData: metaDataReducer,
    teamCruds: adminTeamCrudsReducer,
    auth: authReducer
  },
});
