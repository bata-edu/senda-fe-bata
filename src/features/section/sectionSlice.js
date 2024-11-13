import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RESET_STATE, SECTION_ENDPOINT, SECTION_INDIVIDUAL } from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";

// Thunk para obtener la información de una sección

export const fetchSection = createAsyncThunk(
  "section/fetchSection",
  async (sectionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SECTION_INDIVIDUAL}/${sectionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para obtener un ejercicio de una sección

export const fetchExercise = createAsyncThunk(
  "section/fetchExercise",
  async (exerciseId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SECTION_ENDPOINT}/exercise/${exerciseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const sectionSlice = createSlice({
    name: "section",
    initialState: {
        section: {},
        error: null,
        exercise: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSection.fulfilled, (state, action) => {
                state.section = action.payload;
                state.error = null;
            })
            .addCase(fetchSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(fetchExercise.fulfilled, (state, action) => {
                state.exercise = action.payload;
                state.error = null;
            })
            .addCase(fetchExercise.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(RESET_STATE, (state) => {
                state.section = {};
                state.loading = false;
                state.error = null;
            });
    }
    });

export default sectionSlice.reducer;