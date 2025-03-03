import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RESET_STATE, SECTION_ENDPOINT, SECTION_INDIVIDUAL } from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { decrypt } from "../../utils/decryptData";

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
      const decryptedData =  await decrypt(response.data.encryptedData, response.data.iv);
      return JSON.parse(decryptedData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para obtener las secciones de un nivel

export const fetchSections = createAsyncThunk(
  "section/fetchSections",
  async (levelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SECTION_ENDPOINT}/${levelId}`);
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
        sections: [],
    },
    reducers: {
      clearSections: (state) => {
        state.sections = [];
        state.error = null
        state.exercise =  null;
        state.section = {};
      }
    },
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
            });
        builder
            .addCase(fetchSections.fulfilled, (state, action) => {
                state.sections = action.payload;
                state.error = null;
            })
            .addCase(fetchSections.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(RESET_STATE, (state) => {
                state.section = {};
                state.loading = false;
                state.error = null;
                state.sections = [];
            });
    }
    });
    
export const { clearSections } = sectionSlice.actions;
export default sectionSlice.reducer;