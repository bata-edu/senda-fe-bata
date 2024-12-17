import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EXAM_BY_COURSE, EXAM_ENDPOINT, EXAM_SUBMISSIONS, EXAM_SUBMISSIONS_BY_EXAM, RESET_STATE } from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { genericCreateAndUpload } from "../../utils/createObjectWithFile";
import { buildQueryString } from "../../utils/buildQueryString";


// Thunk para crear un examen
export const createExam = createAsyncThunk(
    "exam/createExam",
    async ({ exam, file }, { rejectWithValue }) => {
        try {
            const createdExam = await genericCreateAndUpload({
                body: exam,
                createUrl: EXAM_ENDPOINT,
                updateUrl: EXAM_ENDPOINT,
                file,
                fileKey: "question"
            });

            return { id: createdExam.id, ...createdExam };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error al crear el examen");
        }
    }
);


// Thunk para obtener las entregas de un examen
export const getExamSubmissions = createAsyncThunk(
    "exam/getExamSubmissions",
    async (submissionId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`${EXAM_SUBMISSIONS}/${submissionId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }

);

// Thunk para obtener las entregas de un examen por examen

export const getExamSubmissionsByExam = createAsyncThunk(
    "exam/getExamSubmissionsByExam",
    async (examId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`${EXAM_SUBMISSIONS_BY_EXAM}/${examId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para corregir una entrega
export const gradeSubmission = createAsyncThunk(
    "exam/gradeSubmission",
    async ({id, score}, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`${EXAM_SUBMISSIONS}/${id}`, {score});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para obtener los examenes por curso
export const getExamsByCourse = createAsyncThunk(
    "exam/getExamsByCourse",
    async ({courseId, query}, { rejectWithValue }) => {
        try {
            const queryString = query ? `?${buildQueryString(query)}` : '';
            const response = await apiClient.get(`${EXAM_BY_COURSE}/${courseId}${queryString}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Creación del slice para los examenes
const examSlice = createSlice({
    name: "exam",
    initialState: {
        exam: null,
        submission: null,
        submissions: null,
        error: null,
        exams: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createExam.fulfilled, (state, action) => {
                state.exam = action.payload;
                state.error = null;
            })
            .addCase(createExam.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getExamSubmissions.fulfilled, (state, action) => {
                state.submission = action.payload;
                state.error = null;
            })
            .addCase(getExamSubmissions.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getExamSubmissionsByExam.fulfilled, (state, action) => {
                state.submissions = action.payload;
                state.error = null;
            })
            .addCase(getExamSubmissionsByExam.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getExamsByCourse.fulfilled, (state, action) => {
                state.exams = action.payload.results;
                state.error = null;
            })
            .addCase(getExamsByCourse.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(RESET_STATE, (state) => {
                state.exam = null;
                state.submission = null;
                state.submissions = null;
                state.error = null;
                state.exams = [];
            });
    }
})

export default examSlice.reducer;