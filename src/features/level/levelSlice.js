import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ALL_LEVELS_ENDPOINT,
  LEVEL_ENDPOINT,
  LEVEL_INFO_ENDPOINT,
  RESET_STATE,
  FINAL_LEVEL_INFO,
} from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";

// Thunk para obtener la información de un nivel
export const fetchLevelInfo = createAsyncThunk(
  "level/fetchLevelInfo",
  async ({ courseId, page, limit }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${LEVEL_INFO_ENDPOINT}/${courseId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para obtener todos los niveles de un módulo
export const fetchAllLevels = createAsyncThunk(
  "level/fetchAllLevels",
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${ALL_LEVELS_ENDPOINT}/${courseId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para obtener la informacion del proyecto final de un nivel

export const fetchFinalLevelInfo = createAsyncThunk(
  "level/fetchFinalLevelInfo",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${FINAL_LEVEL_INFO}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const levelSlice = createSlice({
  name: "level",
  initialState: {
    module: null,
    levelsInfo: null,
    levels: null,
    error: null,
    page: 0,
    finalLevelProyect: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLevelInfo.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchLevelInfo.fulfilled, (state, action) => {
        state.page = state.page + 1;
        state.levelsInfo = action.payload.levels;
        state.module = action.payload.module;
      })
      .addCase(fetchLevelInfo.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(fetchAllLevels.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAllLevels.fulfilled, (state, action) => {
        state.levels = action.payload;
      })
      .addCase(fetchAllLevels.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(fetchFinalLevelInfo.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFinalLevelInfo.fulfilled, (state, action) => {
        state.finalLevelProyect = action.payload;
      })
      .addCase(fetchFinalLevelInfo.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(RESET_STATE, (state) => {
        return {
          module: null,
          levelsInfo: null,
          levels: null,
          error: null,
          page: 0,
          finalLevelProyect: null,
        };
      });
  },
});

export default levelSlice.reducer;
