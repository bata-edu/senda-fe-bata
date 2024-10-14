import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { USER_PROGRESS_ENDPOINT, START_COURSE_ENDPOINT } from '../../utils/constants';
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

const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState: {
    progress: null, 
    loading: false,
    error: null,
    courseId: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
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
      });
  },
});

export default userProgressSlice.reducer;
