import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "../slices/dateSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
  },
});
