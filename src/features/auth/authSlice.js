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
  
  const initialState = loadAuthState();
  export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
      // En producción o con backend configurado, hacemos la petición real
      const response = await apiClient.post(LOGIN_ENDPOINT, credentials)
      const { user, tokens } = response.data
  
      // Guardar en localStorage
      localStorage.setItem("token", tokens.access.token)
      localStorage.setItem("user", JSON.stringify(user))
  
      return { user, token: tokens.access.token }
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
      checkAuth: (state) => {
        // Verificar si el token existe en localStorage
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token")
          const userStr = localStorage.getItem("user")
  
          if (!token || !userStr) {
            state.isAuthenticated = false
            state.user = null
            state.token = null
          }
        }
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
    },
  })
  
  export const { clearError, checkAuth } = authSlice.actions
  export default authSlice.reducer
  