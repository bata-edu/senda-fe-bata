import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  USER_ENDPOINT,
  RANK,
} from "../../utils/constants";
import apiClient from "../../utils/interceptors/authInterceptor";
import { buildQueryString } from "../../utils/buildQueryString";

// Thunk para obtener los progresos del usuario en el modo libre
export const fetchUserFreeModeProgress = createAsyncThunk(
  "freeCode/fetchUserFreeModeProgress",
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
  "freeCode/setActiveFreeModeProgress",
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
  "freeCode/fetchUserFreeModeProgressById",
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
  "freeCode/updateUserFreeModeProgress",
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
  "freeCode/createUserFreeModeProgress",
  async ({ body }, { rejectWithValue }) => {
    try {
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
  "freeCode/fetchRank",
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


const freeCodeSlice = createSlice({
  name: "freeCode",
  initialState: {
    error: null,
    freeModeProgressList: null,
    freeModeProgress: null,
  },
  reducers: {},
  extraReducers: (builder) => {
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
  },
});

export default freeCodeSlice.reducer;
