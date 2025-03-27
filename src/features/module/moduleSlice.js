import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  MODULE_ENDPOINT, 
  LEVEL_INFO_ENDPOINT, 
  SECTION_ENDPOINT, 
  SECTION_INDIVIDUAL,
  RESET_STATE 
} from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { decrypt } from "../../utils/decryptData";

export const fetchModulesInfo = createAsyncThunk(
  "modules/fetchModulesInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${MODULE_ENDPOINT}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLevelInfo = createAsyncThunk(
  "modules/fetchLevelInfo",
  async ({ moduleId, page, limit }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${LEVEL_INFO_ENDPOINT}/${moduleId}?page=${page}&limit=${limit}`
      );
      return { moduleId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSection = createAsyncThunk(
  "modules/fetchSection",
  async (sectionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SECTION_INDIVIDUAL}/${sectionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchExercise = createAsyncThunk(
  "modules/fetchExercise",
  async (exerciseId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SECTION_ENDPOINT}/exercise/${exerciseId}`);
      const decryptedData = await decrypt(response.data.encryptedData, response.data.iv);
      return JSON.parse(decryptedData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  modules: null,
  levels: {},
  sections: {},
  exercises: {},
  error: null,
};

const moduleSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    clearLevels: (state, action) => {
      delete state.levels[action.payload];
    },
    clearSections: (state, action) => {
      delete state.sections[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch modules
      .addCase(fetchModulesInfo.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchModulesInfo.fulfilled, (state, action) => {
        state.modules = action.payload.results;
      })
      .addCase(fetchModulesInfo.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch levels
      .addCase(fetchLevelInfo.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchLevelInfo.fulfilled, (state, action) => {
        const { moduleId, data } = action.payload;
        state.levels[moduleId] = {
          levels: data.levels,
          module: data.module,
          page: (state.levels[moduleId]?.page || 0) + 1
        };
      })
      .addCase(fetchLevelInfo.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch section
      .addCase(fetchSection.fulfilled, (state, action) => {
        state.sections[action.payload._id] = action.payload;
      })
      .addCase(fetchSection.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch exercise
      .addCase(fetchExercise.fulfilled, (state, action) => {
        state.exercises[action.payload._id] = action.payload;
      })
      .addCase(fetchExercise.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(RESET_STATE, () => initialState);
  },
});

// Selectors
export const selectModules = (state) => state.modules.modules;
export const selectModuleError = (state) => state.modules.error;
export const selectLevels = (state, moduleId) => state.modules.levels[moduleId]?.levels;
export const selectModule = (state, moduleId) => state.modules.levels[moduleId]?.module;
export const selectLevelPage = (state, moduleId) => state.modules.levels[moduleId]?.page;
export const selectSection = (state, sectionId) => state.modules.sections[sectionId];
export const selectExercise = (state, exerciseId) => state.modules.exercises[exerciseId];

export const { clearLevels, clearSections } = moduleSlice.actions;
export default moduleSlice.reducer;
