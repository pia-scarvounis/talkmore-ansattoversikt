import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
  name: "date",
  initialState: {
    selectedDate: new Date().toISOString() // måtte endre denne linjen fordi redux ikke liker at man legger til Date direkte i store. nå lagres den som string. når man trenger dato(som objekt) henter vi den: new Date(selectedDate)
  },
  reducers: {
    setDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { setDate } = dateSlice.actions;
export default dateSlice.reducer;
