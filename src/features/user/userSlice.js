import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  USER_ENDPOINT,
  RESET_STATE,
  RANK,
  USER_DETAIL,
  ADMIN_ENDPOINT,
} from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { getUser } from "../auth/authService";
import { buildQueryString } from "../../utils/buildQueryString";

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

// Thunk para obtener los progresos del usuario en el modo libre
export const fetchUserFreeModeProgress = createAsyncThunk(
  "user/fetchUserFreeModeProgress",
  async ({query}, { rejectWithValue }) => {
    try {
      const queryString = query ? `?${buildQueryString(query)}` : '';
      const response = await apiClient.get(
        `${USER_ENDPOINT}/freeModeProgress${queryString}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk para establecer el progreso activo del usuario en modo libre
export const setActiveFreeModeProgress = createAsyncThunk(
  "user/setActiveFreeModeProgress",
  async (progress, { rejectWithValue }) => {
    try {
      return progress;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para obtener el progreso del usuario en modo libre por id
export const fetchUserFreeModeProgressById = createAsyncThunk(
  "user/fetchUserFreeModeProgressById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${USER_ENDPOINT}/freeModeProgress/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

// Thunk para actualizar el progreso del usuario en el modo libre
export const updateUserFreeModeProgress = createAsyncThunk(
  "user/updateUserFreeModeProgress",
  async ({ code, id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `${USER_ENDPOINT}/freeModeProgress/${id}`,
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
  async ({ body }, { rejectWithValue }) => {
    try {
      const user = getUser();
      const response = await apiClient.post(
        `${USER_ENDPOINT}/freeModeProgress`,
        body
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

export const fetchUsers = createAsyncThunk(
  "user/fetchUserCourse",
  async ({query}, { rejectWithValue }) => {
    try {
      const queryString = query ? `?${buildQueryString(query)}` : '';
      const response = await apiClient.get(
        `${ADMIN_ENDPOINT}${queryString}`
      );
      return response;
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
    freeModeProgressList: null,
    freeModeProgress: null,
    rank: null,
    users: null,
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
        state.freeModeProgressList = action.payload;
      })
      .addCase(fetchUserFreeModeProgress.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(fetchUserFreeModeProgressById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserFreeModeProgressById.fulfilled, (state, action) => {
        state.freeModeProgress = action.payload;
      })
      .addCase(fetchUserFreeModeProgressById.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
    .addCase(setActiveFreeModeProgress.pending, (state) => {
      state.error = null;
    })
    .addCase(setActiveFreeModeProgress.fulfilled, (state, action) => {
      state.freeModeProgress = action.payload;
    })
    .addCase(setActiveFreeModeProgress.rejected, (state, action) => {
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
      });
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.data;
      })
      .addCase(RESET_STATE, (state) => {
        return {
          user: null,
          error: null,
          freeModeProgress: null,
          rank: null,
          users: null
        };
      });
  },
});

export default userSlice.reducer;
