import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  MODULE_ENDPOINT, 
  LEVEL_INFO_ENDPOINT, 
  SECTION_ENDPOINT, 
  RESET_STATE 
} from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { decrypt } from "../../utils/decryptData";

export const fetchModules = createAsyncThunk(
  "modules/fetchModules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${MODULE_ENDPOINT}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLevels = createAsyncThunk(
  "modules/fetchLevels",
  async (moduleId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${LEVEL_INFO_ENDPOINT}/${moduleId}`
      );
      return { moduleId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSections = createAsyncThunk(
  "modules/fetchSections",
  async (levelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SECTION_ENDPOINT}/${levelId}`);
      return {levelId, data: response.data};
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchExercisesAndClasses = createAsyncThunk(
  "modules/fetchExercisesAndClasses",
  async (sectionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SECTION_ENDPOINT}/individual/${sectionId}`);
      return {sectionId, data: response.data};
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
  modules: {},
  currentModule: null,
  currentLevel: null,
  currentSection: null,
};

const moduleSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    clearLevels: (state, action) => {
      delete state.modules[action.payload].levels;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch modules
      .addCase(fetchModules.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch levels
      .addCase(fetchLevels.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        const { moduleId, data } = action.payload;
        state.currentModule = moduleId;
        state.modules[moduleId].levels = data;
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch section
      .addCase(fetchSections.fulfilled, (state, action) => {
        const { levelId, data } = action.payload;
        state.currentLevel = levelId;
        state.modules[state.currentModule].levels[levelId].sections = data;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch exercises and classes
      .addCase(fetchExercisesAndClasses.fulfilled, (state, action) => {
        const { sectionId, data } = action.payload;
        state.currentSection = sectionId;
        state.modules[state.currentModule].levels[state.currentLevel].sections[sectionId].exercises = data.sectionExercises;
        state.modules[state.currentModule].levels[state.currentLevel].sections[sectionId].classes = data.sectionClasses;
      })
      .addCase(fetchExercisesAndClasses.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(RESET_STATE, () => initialState);
  },
});

// Selectors
export const selectModules = (state) => state.modules.modules;
export const selectModuleError = (state) => state.modules.error;
export const selectModule = (state, moduleId) => state.modules.modules[moduleId];
export const selectLevels = (state, moduleId) => state.modules.modules[moduleId]?.levels;
export const selectSection = (state, moduleId, levelId, sectionId) => state.modules.modules[moduleId]?.levels[levelId]?.sections[sectionId];
export const selectExercise = (state, moduleId, exerciseId) => state.modules.modules[moduleId]?.exercises[exerciseId];
export const { clearLevels, clearSections } = moduleSlice.actions;
export default moduleSlice.reducer;
