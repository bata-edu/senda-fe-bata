import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/interceptors/authInterceptor";
import { COURSE_ARTICLE_ENDPOINT, COURSE_ARTICLE_DETAIL, RESET_STATE } from "../../utils/constants";

// Thunk para obtener los articulos de un curso
export const getCourseArticles = createAsyncThunk(
    "courseArticle/getCourseArticles",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`${COURSE_ARTICLE_ENDPOINT}/${courseId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para obtener el detalle de un articulo

export const getCourseArticleDetail = createAsyncThunk(
    "courseArticle/getCourseArticleDetail",
    async (articleId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`${COURSE_ARTICLE_DETAIL}/${articleId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para crear un articulo
export const createCourseArticle = createAsyncThunk(
    "courseArticle/createCourseArticle",
    async ({courseId ,article}, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`${COURSE_ARTICLE_ENDPOINT}/${courseId}`, article);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para editar un articulo

export const editCourseArticle = createAsyncThunk(
    "courseArticle/editCourseArticle",
    async ({articleId, article}, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`${COURSE_ARTICLE_DETAIL}/${articleId}`, article);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice para los articulos de un curso

const courseArticleSlice = createSlice({
    name: 'courseArticle',
    initialState: {
        articles: [],
        article: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getCourseArticles.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getCourseArticles.fulfilled, (state, action) => {
            state.loading = false;
            state.articles = action.payload;
        })
        .addCase(getCourseArticles.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getCourseArticleDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getCourseArticleDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.article = action.payload;
        })
        .addCase(getCourseArticleDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(createCourseArticle.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCourseArticle.fulfilled, (state, action) => {
            state.loading = false;
            state.articles.push(action.payload);
        })
        .addCase(createCourseArticle.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(editCourseArticle.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editCourseArticle.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.articles.findIndex((article) => article.id === action.payload.id);
            state.articles[index] = action.payload;
        })
        .addCase(editCourseArticle.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(RESET_STATE, (state) => {
            state.articles = [];
            state.article = {};
            state.loading = false;
            state.error = null;
        });
    }
});

export default courseArticleSlice.reducer;