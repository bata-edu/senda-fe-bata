import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  USER_PROGRESS_ENDPOINT,
  START_COURSE_ENDPOINT,
  RESET_STATE,
  COMPLETE_CLASS_ENDPOINT,
  COMPLETE_EXERCISE_ENDPOINT,
} from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";

// Core thunks
export const fetchUserProgress = createAsyncThunk(
  "userProgress/fetchUserProgress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${USER_PROGRESS_ENDPOINT}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProgressById = createAsyncThunk(
  "userProgress/fetchUserProgressById",
  async (moduleId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${USER_PROGRESS_ENDPOINT}/${moduleId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const startCourse = createAsyncThunk(
  "userProgress/startCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${START_COURSE_ENDPOINT}/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Content completion thunks
export const completeClass = createAsyncThunk(
  "userProgress/completeClass",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${COMPLETE_CLASS_ENDPOINT}/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const completeExercise = createAsyncThunk(
  "userProgress/completeExercise",
  async ({ exerciseId, body }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `${COMPLETE_EXERCISE_ENDPOINT}/${exerciseId}`,
        body
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const advanceProgress = createAsyncThunk(
  "userProgress/advanceProgress",
  async (progressId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `${USER_PROGRESS_ENDPOINT}/advance/${progressId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  progress: null,
  currentProgress: null,
  error: null,
};

const userProgressSlice = createSlice({
  name: "userProgress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all progress
      .addCase(fetchUserProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch progress by ID
      .addCase(fetchUserProgressById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserProgressById.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      })
      .addCase(fetchUserProgressById.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Start course
      .addCase(startCourse.pending, (state) => {
        state.error = null;
      })
      .addCase(startCourse.fulfilled, (state, action) => {
        state.progress = action.payload;
      })
      .addCase(startCourse.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Complete class
      .addCase(completeClass.pending, (state) => {
        state.error = null;
      })
      .addCase(completeClass.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      })
      .addCase(completeClass.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Complete exercise
      .addCase(completeExercise.pending, (state) => {
        state.error = null;
      })
      .addCase(completeExercise.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      })
      .addCase(completeExercise.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Advance progress
      .addCase(advanceProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(advanceProgress.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      })
      .addCase(advanceProgress.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Reset state
      .addCase(RESET_STATE, () => initialState);
  },
});

// Selectors
export const selectProgress = (state) => state.userProgress.progress;
export const selectCurrentProgress = (state) => state.userProgress.currentProgress;
export const selectError = (state) => state.userProgress.error;

export default userProgressSlice.reducer;
