import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { USER_ENDPOINT } from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { getUser } from "../auth/authService";

// Thunk para obtener la información del usuario
export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
        const user = getUser();
        const response = await apiClient.get(`${USER_ENDPOINT}/${user.id}`);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default userSlice.reducer;