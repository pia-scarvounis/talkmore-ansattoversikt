import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

//fetch for backend url /api/dayOverviewEmployees
export const fetchDayOverviewEmployees = createAsyncThunk(
    'availableEmployees/fetchAvailableEmployees',
        async(selectedDate, thunkAPI) =>{
            try{
                const response = await axios.get(`http://localhost:3000/api/dayOverviewEmployees?date=${selectedDate}`);
                return response.data;
            }catch(error){
                return thunkAPI.rejectWithValue(error.response.data);
            }
        }
);

const dayOverviewEmployees = createSlice({
    name: 'dayOverviewEmployees', 
    initialState: {
        //Data som skal holde på tilgjengelige ansatte etter dispatch fetch i komponentet
        data:[],
        loading: false,
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAvailableEmployees.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchAvailableEmployees.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
          })
          .addCase(fetchAvailableEmployees.rejected, (state, action) => {
            state.error = action.payload || 'Noe gikk galt';
            state.loading = false;
          });     
    },
});
export default dayOverviewEmployees.reducer;