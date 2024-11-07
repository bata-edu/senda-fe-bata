import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SCHOOL_ENDPOINT, RESET_STATE, COURSE_ENDPOINT, GET_INTO_COURSE, GET_STUDENTS_IN_COURSE } from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { buildQueryString } from "../../utils/buildQueryString";

// Thunk para obtener todos los cursos de una escuela

export const fetchSchoolCourses = createAsyncThunk(
    "school/fetchSchoolCourses",
    async ({ schoolId, query }, { rejectWithValue }) => {
      try {
        const queryString = query ? `?${buildQueryString(query)}` : '';
  
        const response = await apiClient.get(`${SCHOOL_ENDPOINT}/${schoolId}/courses${queryString}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const createCourse = createAsyncThunk(
    "school/createCourse",
    async ( course , { rejectWithValue }) => {
      try {
        const response = await apiClient.post(`${COURSE_ENDPOINT}`, course);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const getCourseById = createAsyncThunk(
    "school/getCourseById",
    async ( courseId , { rejectWithValue }) => {
      try {
        const response = await apiClient.get(`${COURSE_ENDPOINT}/${courseId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const getIntoCourse = createAsyncThunk(
    "school/getIntoCourse",
    async ( code , { rejectWithValue }) => {
      try {
        const response = await apiClient.post(`${GET_INTO_COURSE}`, code);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const getStudentsInCourse = createAsyncThunk(
    "school/getStudentsInCourse",
    async ( courseId , { rejectWithValue }) => {
      try {
        const response = await apiClient.get(`${GET_STUDENTS_IN_COURSE}/${courseId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);


// Creación del slice para la escuela

const schoolSlice = createSlice({
    name: "school",
    initialState: {
        courses: [],
        error: null,
        students: [],
        course: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSchoolCourses.fulfilled, (state, action) => {
            state.courses = action.payload.results;
        })
        .addCase(fetchSchoolCourses.rejected, (state, action) => {
            state.error = action.payload;
        });
        builder
        .addCase(createCourse.fulfilled, (state, action) => {
            state.courses.push(action.payload);
        })
        .addCase(createCourse.rejected, (state, action) => {
            state.error = action.payload;
        });
        builder
        .addCase(getIntoCourse.fulfilled, (state, action) => {
            state.courses.push(action.payload);
        })
        .addCase(getIntoCourse.rejected, (state, action) => {
            state.error = action.payload;
        })
        builder
        .addCase(getStudentsInCourse.fulfilled, (state, action) => {
            state.students = action.payload.results;
        })
        .addCase(getStudentsInCourse.rejected, (state, action) => {
            state.error = action.payload;
        });
        builder
        .addCase(getCourseById.fulfilled, (state, action) => {
            state.course = action.payload;
        })
        .addCase(getCourseById.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(RESET_STATE, (state) => {
            return {
              courses: [],
              error: null,
              students: [],
              course: null,
            };
        });
    }
});

export default schoolSlice.reducer;
  