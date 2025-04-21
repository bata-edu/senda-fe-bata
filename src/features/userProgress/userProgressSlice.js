import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  USER_PROGRESS_ENDPOINT,
  START_COURSE_ENDPOINT,
  RESET_STATE,
  COMPLETE_CLASS_ENDPOINT,
  COMPLETE_EXERCISE_ENDPOINT,
} from "../../utils/constants"
import apiClient from "../../utils/interceptors/authInterceptor"

// Core thunks
export const fetchUserProgress = createAsyncThunk(
  "userProgress/fetchUserProgress",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check if progress is already loaded
      const state = getState()
      if (state.userProgress.progress) {
        return state.userProgress.progress
      }

      const response = await apiClient.get(`${USER_PROGRESS_ENDPOINT}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

export const fetchUserModuleProgress = createAsyncThunk(
  "userProgress/fetchUserModuleProgress",
  async ({ moduleId, moduleSlug }, { rejectWithValue, getState }) => {
    try {
      // Check if module progress is already loaded
      const state = getState()
      if (state.userProgress.progress && state.userProgress.progress[moduleSlug]) {
        return { moduleId, moduleSlug, data: state.userProgress.progress[moduleSlug] }
      }

      const response = await apiClient.get(`${USER_PROGRESS_ENDPOINT}/${moduleId}`)
      return { moduleId, moduleSlug, data: response.data }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

export const fetchUserSectionProgress = createAsyncThunk(
  "userProgress/fetchUserSectionProgress",
  async ({ moduleSlug, sectionId }, { rejectWithValue, getState }) => {
    try {
      // Check if section progress is already in state
      const state = getState()
      const currentSection = state.userProgress.currentSection
      const currentModule = state.userProgress.progress[moduleSlug]
      
      if (
        currentSection &&
        currentSection.sectionId === sectionId
      ) {
        return currentSection
      }

      const response = await apiClient.get(`${USER_PROGRESS_ENDPOINT}/${currentModule.id}/${sectionId}`)
      return { sectionId, progress: response.data }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

export const startCourse = createAsyncThunk("userProgress/startCourse", async (moduleId, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(`${START_COURSE_ENDPOINT}/${moduleId}`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const completeClass = createAsyncThunk(
  "userProgress/completeClass",
  async ({ progressId, classId }, { rejectWithValue, dispatch }) => {
    try {
      // Optimistically update the state before API call
      dispatch(optimisticallyCompleteClass(classId))

      // Make the API call
      await apiClient.post(`${COMPLETE_CLASS_ENDPOINT}/${progressId}/${classId}`)
      return classId
    } catch (error) {
      // If API call fails, we need to revert the optimistic update
      dispatch(revertOptimisticClassCompletion(classId))
      return rejectWithValue(error.response.data)
    }
  },
)

export const completeExercise = createAsyncThunk(
  "userProgress/completeExercise",
  async ({ progressId, exerciseId, userAnswers }, { rejectWithValue, dispatch, getState }) => {
    try {
      // Get the current section and exercise data to check correctness
      const state = getState()
      const exercise = state.userProgress.nextContentToShow
      let isCorrect = false
      if (exercise) {
        const correctAnswers = exercise.answers || []
        isCorrect =
          userAnswers.length === correctAnswers.length &&
          userAnswers.every((answer, index) => answer === correctAnswers[index])
      }

      // Optimistically update the state before API call
      dispatch(
        optimisticallyCompleteExercise({
          exerciseId,
          isCorrect,
        }),
      )

      // Make the API call
      await apiClient.post(`${COMPLETE_EXERCISE_ENDPOINT}/${progressId}/${exerciseId}`, {is_correct: isCorrect})

      return {
        exerciseId,
        isCorrect,
      }
    } catch (error) {
      // If API call fails, we need to revert the optimistic update
      dispatch(revertOptimisticExerciseCompletion(exerciseId))
      return rejectWithValue(error)
    }
  },
)

export const advanceProgress = createAsyncThunk(
  "userProgress/advanceProgress",
  async ({ moduleId, sectionId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${USER_PROGRESS_ENDPOINT}/advance/${moduleId}/${sectionId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

const initialState = {
  progress: null,
  currentSection: null,
  loadingCurrentSection: false,
  error: null,
  // New fields for optimistic updates
  pendingClassCompletions: [],
  pendingExerciseCompletions: [],
  nextContentToShow: null,
  contentType: null,
  sectionCompleted: false,
  // Track if we're in the "review incorrect exercises" phase
  reviewingIncorrectExercises: false,
  // Track if we've completed all exercises at least once
  allExercisesAttempted: false,
  loading: false,
}

const userProgressSlice = createSlice({
  name: "userProgress",
  initialState,
  reducers: {
    // Existing reducers remain the same
    clearSectionProgress: (state) => {
      state.currentSection = null
      state.nextContentToShow = null
      state.contentType = null
      state.sectionCompleted = false
      state.reviewingIncorrectExercises = false
      state.allExercisesAttempted = false
    },

    // New reducers for optimistic updates
    optimisticallyCompleteClass: (state, action) => {
      const classId = action.payload

      // Add to completed classes if not already there
      if (!state.currentSection.progress.completed_classes.includes(classId)) {
        state.currentSection.progress.completed_classes.push(classId)
      }

      // Add to pending completions to track API calls
      state.pendingClassCompletions.push(classId)
    },

    revertOptimisticClassCompletion: (state, action) => {
      const classId = action.payload

      // Remove from completed classes
      state.currentSection.progress.completed_classes = state.currentSection.progress.completed_classes.filter(
        (id) => id !== classId,
      )

      // Remove from pending completions
      state.pendingClassCompletions = state.pendingClassCompletions.filter((id) => id !== classId)
    },

    optimisticallyCompleteExercise: (state, action) => {
      const { exerciseId, isCorrect } = action.payload

      // Check if exercise is already completed
      const existingIndex = state.currentSection.progress.completed_exercises.findIndex(
        (ex) => ex.exercise_id === exerciseId,
      )

      if (existingIndex >= 0) {
        // Update existing exercise completion
        state.currentSection.progress.completed_exercises[existingIndex] = {
          exercise_id: exerciseId,
          isCorrect,
        }
      } else {
        // Add new exercise completion
        state.currentSection.progress.completed_exercises.push({
          exercise_id: exerciseId,
          isCorrect,
        })
      }

      // Add to pending completions
      state.pendingExerciseCompletions.push(exerciseId)
    },

    revertOptimisticExerciseCompletion: (state, action) => {
      const exerciseId = action.payload

      // Remove from completed exercises
      state.currentSection.progress.completed_exercises = state.currentSection.progress.completed_exercises.filter(
        (ex) => ex.exerciseId !== exerciseId,
      )

      // Remove from pending completions
      state.pendingExerciseCompletions = state.pendingExerciseCompletions.filter((id) => id !== exerciseId)
    },

    // Determine next content based on current progress
    determineNextContent: (state, action) => {
      const { sectionData } = action.payload
      if (!state.currentSection || !sectionData) return
      const completed_classes = state.currentSection.progress.completed_classes
      const completed_exercises = state.currentSection.progress.completed_exercises

      // First, check if there are any classes left to complete
      if (sectionData.classes.length > completed_classes.length) {
        const nextClassIndex = completed_classes.length
        state.nextContentToShow = sectionData.classes[nextClassIndex]
        state.contentType = "class"
        state.reviewingIncorrectExercises = false
        state.allExercisesAttempted = false
        return
      }

      // If all classes are completed, check if we need to go through exercises
      const allExerciseIds = sectionData.exercises.map((ex) => ex.id)
      const completedExerciseIds = completed_exercises.map((ex) => ex.exercise_id)

      // Check if all exercises have been attempted at least once
      const allExercisesAttempted = allExerciseIds.every((id) => completedExerciseIds.includes(id))
      state.allExercisesAttempted = allExercisesAttempted

      // If we haven't attempted all exercises yet, go through them in order
      if (!allExercisesAttempted) {
        const currentOrder = state.nextContentToShow?.order ?? -1
      
        const nextExercise = sectionData.exercises.find(
          (ex) =>
            !completedExerciseIds.includes(ex.id) &&
            ex.order > currentOrder
        )
      
        if (nextExercise) {
          state.nextContentToShow = nextExercise
          state.contentType = "exercise"
          state.reviewingIncorrectExercises = false
          return
        }
      }
      

      // If all exercises have been attempted, check for incorrect ones
      const incorrectExercises = sectionData.exercises.filter((ex) => {
        const completed = completed_exercises.find((done) => done.exercise_id === ex.id)
        return completed && !completed.isCorrect
      })

      // If there are incorrect exercises, go through them
      if (incorrectExercises.length > 0) {
        state.reviewingIncorrectExercises = true

        // Buscar el índice del último incorrecto mostrado (si existe)
        const lastIncorrectId = state.nextContentToShow?.id
        const currentIndex = incorrectExercises.findIndex((ex) => ex.id === lastIncorrectId)

        // Mostrar el siguiente incorrecto en la lista (si hay uno)
        const nextIncorrect = incorrectExercises[currentIndex + 1] || incorrectExercises[0]

        state.nextContentToShow = nextIncorrect
        state.contentType = "exercise"
        return
      }

      // If all exercises are correct, mark section as completed
      state.contentType = "section-completed"
      state.sectionCompleted = true
      state.nextContentToShow = null
      state.reviewingIncorrectExercises = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all progress
      .addCase(fetchUserProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.progress = action.payload
        state.loading = false
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(fetchUserModuleProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserModuleProgress.fulfilled, (state, action) => {
        const { data, moduleSlug } = action.payload
        if (!state.progress) {
          state.progress = {}
        }
        state.progress[moduleSlug] = data
        state.loading = false
      })
      .addCase(fetchUserModuleProgress.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      // Fetch user section progress
      .addCase(fetchUserSectionProgress.pending, (state) => {
        state.error = null
        state.loadingCurrentSection = true
      })
      .addCase(fetchUserSectionProgress.fulfilled, (state, action) => {
        state.currentSection = action.payload
        state.loadingCurrentSection = false
        // Reset optimistic update tracking
        state.pendingClassCompletions = []
        state.pendingExerciseCompletions = []
        state.sectionCompleted = false
        state.reviewingIncorrectExercises = false
        state.allExercisesAttempted = false
      })
      .addCase(fetchUserSectionProgress.rejected, (state, action) => {
        state.error = action.payload
        state.loadingCurrentSection = false
      })
      // Start course
      .addCase(startCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startCourse.fulfilled, (state, action) => {
        state.progress = action.payload
        state.loading = false
      })
      .addCase(startCourse.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      // Complete class - now just confirms the optimistic update
      .addCase(completeClass.pending, (state) => {
        state.error = null
      })
      .addCase(completeClass.fulfilled, (state, action) => {
        // Remove from pending completions since API call succeeded
        state.pendingClassCompletions = state.pendingClassCompletions.filter((id) => id !== action.payload)
        state.loadingCurrentSection = false
      })
      .addCase(completeClass.rejected, (state, action) => {
        state.error = action.payload
        state.loadingCurrentSection = false
      })
      // Complete exercise - now just confirms the optimistic update
      .addCase(completeExercise.pending, (state) => {
        state.error = null
      })
      .addCase(completeExercise.fulfilled, (state, action) => {
        // Remove from pending completions since API call succeeded
        state.pendingExerciseCompletions = state.pendingExerciseCompletions.filter(
          (id) => id !== action.payload.exerciseId,
        )
        state.loadingCurrentSection = false
      })
      .addCase(completeExercise.rejected, (state, action) => {
        state.error = action.payload
        state.loadingCurrentSection = false
      })
      // Advance progress
      .addCase(advanceProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(advanceProgress.fulfilled, (state, action) => {
        state.currentProgress = action.payload
        state.sectionCompleted = false
        state.loading = false
      })
      .addCase(advanceProgress.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      // Reset state
      .addCase(RESET_STATE, () => initialState)
  },
})

// Selectors
export const selectProgress = (state) => state.userProgress.progress
export const selectCurrentProgress = (state) => state.userProgress.currentProgress
export const selectError = (state) => state.userProgress.error
export const selectCurrentSection = (state) => state.userProgress.currentSection
export const selectNextContent = (state) => state.userProgress.nextContentToShow
export const selectContentType = (state) => state.userProgress.contentType
export const selectSectionCompleted = (state) => state.userProgress.sectionCompleted
export const selectIsLoading = (state) => state.userProgress.loadingCurrentSection || state.userProgress.loading
export const selectReviewingIncorrectExercises = (state) => state.userProgress.reviewingIncorrectExercises
export const selectAllExercisesAttempted = (state) => state.userProgress.allExercisesAttempted

export const {
  clearSectionProgress,
  optimisticallyCompleteClass,
  revertOptimisticClassCompletion,
  optimisticallyCompleteExercise,
  revertOptimisticExerciseCompletion,
  determineNextContent,
} = userProgressSlice.actions

export default userProgressSlice.reducer
