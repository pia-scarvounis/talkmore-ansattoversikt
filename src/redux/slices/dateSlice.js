import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
  name: "date",
  initialState: {
    selectedDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD,
  },
  reducers: {
    setDate: (state, action) => {
      if (action.payload instanceof Date) {
        state.selectedDate = action.payload.toISOString().split("T")[0];
      } else {
        state.selectedDate = action.payload;
      }
    },
  },
});

export const { setDate } = dateSlice.actions;
export default dateSlice.reducer;
