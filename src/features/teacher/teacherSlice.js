import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SCHOOL_TEACHER_ENDPOINT, SCHOOL_TEACHER_INTOSCHOOL, RESET_STATE } from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";

// Thunk para obtener las escuelas a las que pertenece el profesor

export const fetchSchools = createAsyncThunk(
    "schoolTeacher/fetchSchools",
    async (_, { rejectWithValue }) => {
        try {
        const response = await apiClient.get(SCHOOL_TEACHER_ENDPOINT);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para acceder a una escuela

export const getIntoSchool = createAsyncThunk(
    "schoolTeacher/getIntoSchool",
    async (code, { rejectWithValue }) => {
        try {
        await apiClient.post(SCHOOL_TEACHER_INTOSCHOOL, {code});
        } catch (error) {
        return rejectWithValue(error.response.data);
        }
    }
);

// Creación del slice para el profesor

const schoolTeacherSlice = createSlice({
    name: "schoolTeacher",
    initialState: {
        teacherSchools: [],
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSchools.fulfilled, (state, action) => {
            state.teacherSchools = action.payload;
        })
        .addCase(fetchSchools.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(RESET_STATE, (state) => {
            return {
              user: null,
              error: null,
              teacherSchools: null,
              rank: null,
            };
        });
    }
});

export default schoolTeacherSlice.reducer;
