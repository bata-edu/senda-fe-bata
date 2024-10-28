import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MODULE_ENDPOINT, RESET_STATE } from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";

// Thunk para obtener la información de un nivel
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

export const setSelectedModule = createAsyncThunk(
  "modules/setSelectedModule",
  async (moduleId, { rejectWithValue }) => {
    try {
      return moduleId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const moduleSlice = createSlice({
  name: "modules",
  initialState: {
    modules: null,
    selectedModule: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModulesInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModulesInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload.results;
      })
      .addCase(fetchModulesInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(setSelectedModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setSelectedModule.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedModule = action.payload;
      })
      .addCase(setSelectedModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(RESET_STATE, (state) => {
        state.modules = null;
        state.selectedModule = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default moduleSlice.reducer;
