import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { USER_PROGRESS_ENDPOINT, START_COURSE_ENDPOINT, RESET_STATE, MY_NEXT_ACTION, MY_NEXT_EXERCISE, ADVANCE_COURSE, SKIP_CLASS, SUBMIT_FINAL_LEVEL, COMPLETE_CLASS_ENDPOINT, COMPLETE_EXERCISE_ENDPOINT, MY_NEXT_CLASS } from '../../utils/constants';
import apiClient from '../../utils/interceptors/authInterceptor';

// Thunk para obtener el progreso del curso del usuario
export const fetchUserProgress = createAsyncThunk(
    'userProgress/fetchUserProgress',
    async (_,{ rejectWithValue }) => {
      try {
        const response = await apiClient.get(`${USER_PROGRESS_ENDPOINT}`);
        return response.data; 
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const fetchUserProgressById = createAsyncThunk(
  'userProgress/fetchUserProgressById',
  async (progressId,{ rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${USER_PROGRESS_ENDPOINT}/${progressId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

  
// Thunk para iniciar un curso
export const startCourse = createAsyncThunk(
  'userProgress/startCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${START_COURSE_ENDPOINT}/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para obtener la siguiente acción del usuario
export const fetchNextAction = createAsyncThunk(
  'userProgress/fetchNextAction',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${MY_NEXT_ACTION}/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

// Thunk para obtener la siguiente clase del usuario
export const fetchNextClass = createAsyncThunk(
  'userProgress/fetchNextClass',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${MY_NEXT_CLASS}/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

// Thunk para completar una clase
export const completeClass = createAsyncThunk(
  'userProgress/completeClass',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${COMPLETE_CLASS_ENDPOINT}/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

// Thunk para obtener el siguiente ejercicio del usuario
export const fetchNextExercise = createAsyncThunk(
  'userProgress/fetchNextExercise',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${MY_NEXT_EXERCISE}/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

// Thunk para completar un ejercicio
export const completeExercise = createAsyncThunk(
  'userProgress/completeExercise',
  async ({exerciseId, body}, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${COMPLETE_EXERCISE_ENDPOINT}/${exerciseId}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

// Thunk para avanzar en el curso
export const advanceCourse = createAsyncThunk(
  'userProgress/advanceCourse',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${ADVANCE_COURSE}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

// Thunk para saltar una clase
export const skipClass = createAsyncThunk(
  'userProgress/skipClass',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${SKIP_CLASS}/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

// Thunk para enviar el proyecto final del nivel

export const submitFinalLevel = createAsyncThunk(
  'userProgress/submitFinalLevel',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${SUBMIT_FINAL_LEVEL}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState: {
    progress: null, 
    loading: false,
    error: null,
    courseId: null,
    nextAction: null,
    myClass: null,
    myExercise: null

  },
  reducers: {},
  extraReducers: (builder) => {
    // Maneja la obtención del progreso del curso del usuario
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload[0];
        if(action.payload.length > 0){
          state.courseId = action.payload[0].course;
        }
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Maneja el inicio del curso
    builder
      .addCase(startCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(startCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Maneja la obtención de la siguiente acción del usuario
      builder
      .addCase(fetchNextAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNextAction.fulfilled, (state, action) => {
        state.loading = false;
        state.nextAction = action.payload;
      })
      .addCase(fetchNextAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Maneja la obtención de la siguiente clase del usuario
      builder
      .addCase(fetchNextClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNextClass.fulfilled, (state, action) => {
        state.loading = false;
        state.myClass = action.payload;
      })
      .addCase(fetchNextClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Maneja la obtención del siguiente ejercicio del usuario
      builder
      .addCase(fetchNextExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNextExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.myExercise = action.payload;
      })
      .addCase(fetchNextExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Maneja la completación de una clase
      builder
      .addCase(completeClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeClass.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(completeClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Maneja la completación de un ejercicio
      builder
      .addCase(completeExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(completeExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Maneja el avance en el curso
      builder
      .addCase(advanceCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(advanceCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(advanceCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Maneja el salto de una clase
      builder
      .addCase(skipClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(skipClass.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(skipClass.rejected, (
        state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Maneja el envío del proyecto final del nivel
      builder
      .addCase(submitFinalLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFinalLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(submitFinalLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(RESET_STATE,(state) => {
        return {
          progress: null,
          loading: false,
          error: null,
          courseId: null,
          nextAction: null,
          myClass: null,
          myExercise: null
        }
      });
  },
});

export default userProgressSlice.reducer;
