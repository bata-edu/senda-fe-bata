import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  USER_ENDPOINT,
  RESET_STATE,
  RANK,
  USER_DETAIL,
} from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { getUser } from "../auth/authService";

// Thunk para obtener la información del usuario
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = getUser();
      const response = await apiClient.get(`${USER_DETAIL}/${user.id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para obtener el progreso del usuario en el modo libre
export const fetchUserFreeModeProgress = createAsyncThunk(
  "user/fetchUserFreeModeProgress",
  async (_, { rejectWithValue }) => {
    try {
      const user = getUser();
      const response = await apiClient.get(
        `${USER_ENDPOINT}/freeModeProgress/${user.id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para actualizar el progreso del usuario en el modo libre
export const updateUserFreeModeProgress = createAsyncThunk(
  "user/updateUserFreeModeProgress",
  async ({ code }, { rejectWithValue }) => {
    try {
      const user = getUser();
      const response = await apiClient.patch(
        `${USER_ENDPOINT}/freeModeProgress/${user.id}`,
        code
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para crear el progreso del usuario en el modo libre

export const createUserFreeModeProgress = createAsyncThunk(
  "user/createUserFreeModeProgress",
  async ({ code }, { rejectWithValue }) => {
    try {
      const user = getUser();
      const response = await apiClient.post(
        `${USER_ENDPOINT}/freeModeProgress/${user.id}`,
        code
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para obtener el ranking de los usuarios
export const fetchRank = createAsyncThunk(
  "user/fetchRank",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${RANK}?page=1&limit=5&sortBy=points:desc`
      );
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
    error: null,
    freeModeProgress: null,
    rank: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(fetchUserFreeModeProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserFreeModeProgress.fulfilled, (state, action) => {
        state.freeModeProgress = action.payload;
      })
      .addCase(fetchUserFreeModeProgress.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(updateUserFreeModeProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserFreeModeProgress.fulfilled, (state, action) => {
        state.freeModeProgress = action.payload;
      })
      .addCase(updateUserFreeModeProgress.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(createUserFreeModeProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(createUserFreeModeProgress.fulfilled, (state, action) => {
        state.freeModeProgress = action.payload;
      })
      .addCase(createUserFreeModeProgress.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(fetchRank.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchRank.fulfilled, (state, action) => {
        state.rank = action.payload.results;
      })
      .addCase(fetchRank.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(RESET_STATE, (state) => {
        return {
          user: null,
          error: null,
          freeModeProgress: null,
          rank: null,
        };
      });
  },
});

export default userSlice.reducer;
