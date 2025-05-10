import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { MODULE_ENDPOINT, LEVEL_INFO_ENDPOINT, SECTION_ENDPOINT, RESET_STATE } from "../../utils/constants"
import apiClient from "../../utils/interceptors/authInterceptor"
import { decrypt } from "../../utils/decryptData"

export const fetchModules = createAsyncThunk("modules/fetchModules", async (_, { rejectWithValue, getState }) => {
  try {
    // Check if modules are already loaded
    const state = getState()
    if (Object.keys(state.modules.modules).length > 0) {
      return state.modules.modules
    }

    const response = await apiClient.get(`${MODULE_ENDPOINT}`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchModule = createAsyncThunk(
  "modules/fetchModule",
  async (moduleSlug, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      // Check if this specific module is already loaded
      if (state.modules.modules.by_slug?.[moduleSlug]) {
        return {
          moduleSlug,
          module: state.modules.modules.by_slug[moduleSlug],
          moduleId: state.modules.modules.by_slug[moduleSlug].id,
        }
      }

      // If not, fetch all modules
      const response = await apiClient.get(`${MODULE_ENDPOINT}`)

      // Find the module ID for the given slug
      const modules = response.data
      const moduleId = modules.by_slug[moduleSlug]?.id

      return { moduleSlug, modules, moduleId }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

export const fetchLevels = createAsyncThunk(
  "modules/fetchLevels",
  async (moduleSlug, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      // Check if levels for this module are already loaded
      if (state.modules.modules.by_slug?.[moduleSlug]?.levels) {
        return { moduleSlug, levels: state.modules.modules.by_slug[moduleSlug].levels }
      }

      const moduleId = state.modules.modules.by_slug?.[moduleSlug]?.id
      if (!moduleId) {
        throw new Error("Module not found")
      }

      const response = await apiClient.get(`${LEVEL_INFO_ENDPOINT}/${moduleId}`)
      return { moduleSlug, levels: response.data }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const fetchSections = createAsyncThunk(
  "modules/fetchSections",
  async (levelId, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const currentModule = state.modules.currentModule

      // Check if sections for this level are already loaded
      if (state.modules.modules[currentModule]?.levels[levelId]?.sections) {
        return {
          levelId,
          data: state.modules.modules[currentModule].levels[levelId].sections,
        }
      }

      const response = await apiClient.get(`${SECTION_ENDPOINT}/${levelId}`)
      return { levelId, data: response.data }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

export const fetchExercisesAndClasses = createAsyncThunk(
  "modules/fetchExercisesAndClasses",
  async ({levelId, sectionId}, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const currentModule = state.modules.currentModule
      const currentLevel = state.modules.currentLevel

      // Check if exercises and classes for this section are already loaded
      if (state.modules.modules[currentModule]?.levels[currentLevel]?.sections[sectionId]?.exercises) {
        return {
          sectionId,
          data: {
            sectionExercises: state.modules.modules[currentModule].levels[currentLevel].sections[sectionId].exercises,
            sectionClasses: state.modules.modules[currentModule].levels[currentLevel].sections[sectionId].classes,
          },
        }
      }

      const response = await apiClient.get(`${SECTION_ENDPOINT}/${levelId}/${sectionId}`)
      console.log(response.data)
      return { sectionId, data: response.data }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

export const fetchExercise = createAsyncThunk("modules/fetchExercise", async (exerciseId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`${SECTION_ENDPOINT}/exercise/${exerciseId}`)
    const decryptedData = await decrypt(response.data.encryptedData, response.data.iv)
    return JSON.parse(decryptedData)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const initialState = {
  modules: {},
  currentModule: null,
  currentModuleId: null,
  currentLevel: null,
  currentSection: null,
  loading: false,
  error: null,
}

const moduleSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    clearLevels: (state, action) => {
      delete state.modules[action.payload].levels
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch modules
      .addCase(fetchModules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.modules = action.payload
        state.loading = false
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      // Fetch single module
      .addCase(fetchModule.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchModule.fulfilled, (state, action) => {
        if (action.payload.modules) {
          // If we fetched all modules
          state.modules = action.payload.modules
        }
        state.currentModule = action.payload.moduleSlug
        state.currentModuleId = action.payload.moduleId
        state.loading = false
      })
      .addCase(fetchModule.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      // Fetch levels
      .addCase(fetchLevels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        const { moduleSlug, levels } = action.payload
        state.currentModule = moduleSlug
        state.modules.by_slug[moduleSlug].levels = levels
        state.loading = false
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      // Fetch section
      .addCase(fetchSections.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        const { levelId, data } = action.payload
        state.currentLevel = levelId
        state.modules.by_slug[state.currentModule].levels[levelId].sections = data
        state.loading = false
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      // Fetch exercises and classes
      .addCase(fetchExercisesAndClasses.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchExercisesAndClasses.fulfilled, (state, action) => {
        const { sectionId, data } = action.payload
        const { exercises, classes } = data
        state.currentSection = sectionId
        state.modules.by_slug[state.currentModule].levels[state.currentLevel].sections[sectionId].exercises = exercises
        state.modules.by_slug[state.currentModule].levels[state.currentLevel].sections[sectionId].classes =   classes
        state.loading = false
      })
      .addCase(fetchExercisesAndClasses.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(RESET_STATE, () => initialState)
  },
})

// Selectors
export const selectModules = (state) => state.modules.modules
export const selectModuleError = (state) => state.modules.error
export const selectModuleLoading = (state) => state.modules.loading
export const selectModule = (state, moduleSlug) => state.modules.modules.by_slug?.[moduleSlug]
export const selectModuleId = (state, moduleSlug) => state.modules.modules.by_slug?.[moduleSlug]?.id
export const selectCurrentModuleId = (state) => state.modules.currentModuleId
export const selectLevels = (state, moduleSlug) => state.modules.modules?.by_slug?.[moduleSlug]?.levels
export const selectSection = (state, moduleSlug, levelId, sectionId) =>
  state.modules.modules.by_slug?.[moduleSlug]?.levels[levelId]?.sections[sectionId]
export const selectExercise = (state, moduleSlug, exerciseId) =>
  state.modules.modules.by_slug?.[moduleSlug]?.exercises[exerciseId]
export const { clearLevels } = moduleSlice.actions
export default moduleSlice.reducer
