import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/interceptors/authInterceptor";
import { LOGIN_ENDPOINT } from "../../utils/constants";
const loadAuthState = () => {
    if (typeof window === "undefined") {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    }
  
    try {
      const token = localStorage.getItem("token")
      const userStr = localStorage.getItem("user")
  
      if (token && userStr) {
        const user = JSON.parse(userStr)
        return {
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }
      }
    } catch (error) {
      console.error("Error loading auth state from localStorage", error)
    }
  
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  }

  export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const userStr = localStorage.getItem("user")
  
      if (token && userStr) {
        return {
          token,
          user: JSON.parse(userStr),
        }
      }
    }
  
    return thunkAPI.rejectWithValue("No auth")
  })
  
  const initialState = loadAuthState();
  export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
      // En producción o con backend configurado, hacemos la petición real
      const response = await apiClient.post(LOGIN_ENDPOINT, credentials)
      const { user, token } = response.data
      console.log(response.data)
  
      // Guardar en localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
  
      return { user, token }
    } catch {
      return rejectWithValue("Error de autenticación")
    }
  })
  
  export const logout = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return null
  })
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.isLoading = true
          state.error = null
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false
          state.error = (action.payload) || "Error de autenticación"
        })
        .addCase(logout.fulfilled, (state) => {
          state.isAuthenticated = false
          state.user = null
          state.token = null
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
          state.token = action.payload.token
          state.user = action.payload.user
          state.isAuthenticated = true
        })
        .addCase(checkAuth.rejected, (state) => {
          state.token = null
          state.user = null
          state.isAuthenticated = false
        })
    },
  })
  
  export const { clearError } = authSlice.actions
  export default authSlice.reducer
  