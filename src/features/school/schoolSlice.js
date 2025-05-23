import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SCHOOL_ENDPOINT, RESET_STATE, COURSE_ENDPOINT, GET_INTO_COURSE, GET_STUDENTS_IN_COURSE, GET_STUDENTS_PROGRESS, GET_COURSE_AND_SCHOOL } from "../../utils/constants";
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

export const getStudentsProgress = createAsyncThunk(
    "school/getStudentsProgress",
    async ( {courseId, moduleId}, { rejectWithValue }) => {
      try {
        const response = await apiClient.get(`${GET_STUDENTS_PROGRESS}/${courseId}/${moduleId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
  }
});

export const getTeachers = createAsyncThunk(
    "school/getTeachers",
    async ( {schoolId, query} , { rejectWithValue }) => {
      try {
        const queryString = query ? `?${buildQueryString(query)}` : '';
        const response = await apiClient.get(`${SCHOOL_ENDPOINT}/${schoolId}/teachers${queryString}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
)

export const getSchoolById = createAsyncThunk(
    "school/getSchoolById",
    async ( schoolId , { rejectWithValue }) => {
      try {
        const response = await apiClient.get(`${SCHOOL_ENDPOINT}/${schoolId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const getCourseAndSchool = createAsyncThunk(
    "school/getCourseAndSchool",
    async ( courseId , { rejectWithValue }) => {
      try {
        const response = await apiClient.get(`${GET_COURSE_AND_SCHOOL}/${courseId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const saveSchoolLocalStorage = (school) => {
    localStorage.setItem("school", JSON.stringify(school));
}

export const getSchoolLocalStorage = () => {
    return JSON.parse(localStorage.getItem("school"));
}

export const saveCourseLocalStorage = (course) => {
    localStorage.setItem("course", JSON.stringify(course));
}

export const getCourseLocalStorage = () => {
    return JSON.parse(localStorage.getItem("course"));
}


// Creación del slice para la escuela

const schoolSlice = createSlice({
    name: "school",
    initialState: {
        courses: [],
        error: null,
        students: [],
        course: null,
        teachers: [],
        school: null,
        students_module: []
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
        .addCase(getSchoolById.fulfilled, (state, action) => {
            state.school = action.payload;
        })
        .addCase(getSchoolById.rejected, (state, action) => {
            state.error = action.payload;
        });
        builder
        .addCase(getTeachers.fulfilled, (state, action) => {
            state.teachers = action.payload.results;
        })
        .addCase(getTeachers.rejected, (state, action) => {
            state.error = action.payload;
        });
        builder
        .addCase(getCourseById.fulfilled, (state, action) => {
            state.course = action.payload;
        })
        .addCase(getCourseById.rejected, (state, action) => {
            state.error = action.payload;
        });
        builder
        .addCase(getStudentsProgress.fulfilled, (state, action) => {
            state.students_module = action.payload;
        })
        .addCase(getStudentsProgress.rejected, (state, action) => {
            state.error = action.payload;
        });
        builder
        .addCase(getCourseAndSchool.fulfilled, (state, action) => {
            state.course = action.payload;
        })
        .addCase(getCourseAndSchool.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(RESET_STATE, (state) => {
            return {
              courses: [],
              error: null,
              students: [],
              course: null,
              teachers: [],
              school: null
            };
        });
    }
});

export default schoolSlice.reducer;
  