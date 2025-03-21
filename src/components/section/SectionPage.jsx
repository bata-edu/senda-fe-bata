"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  advanceProgress,
  completeClass,
  completeExercise,
  fetchUserProgressById,
} from "../../features/userProgress/userProgressSlice"
import { fetchSection } from "../../features/section/sectionSlice"
import SectionClass from "./class/Class"
import Exercise from "./exercise/Exercise"
import LoadingPage from "../../pages/LoadingPage"
import BackLogo from "../../assets/icons/back.png"
import { courseImageSectionPage as courseImage } from "../../utils/courseImage"
import { ADVANCE_LEVEL, ADVANCE_SECTION } from "../../utils/constants"

export const SectionPage = () => {
  const navigate = useNavigate()
  const { moduleId, levelId, sectionId } = useParams()
  const dispatch = useDispatch()

  // Redux state
  const { currentProgress } = useSelector((state) => state.userProgress || {})
  const { section  } = useSelector((state) => state.section || {})

  // Local state
  const [loading, setLoading] = useState(true)
  const [currentContent, setCurrentContent] = useState(null)
  const [contentType, setContentType] = useState(null) // "class" or "exercise" or "section-completed"
  const [progress, setProgress] = useState(0)

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      if (!moduleId || !levelId || !sectionId) return

      try {
        setLoading(true)

        // Fetch user progress
        await dispatch(fetchUserProgressById(moduleId)).unwrap()

        // Fetch section data
        const sectionData = await dispatch(fetchSection(sectionId)).unwrap()

        // Calculate progress
        calculateProgress(sectionData)

        // Determine current content based on user progress
        determineCurrentContent(sectionData)
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [dispatch, moduleId, levelId, sectionId])

  // Calculate progress percentage
  const calculateProgress = (sectionData) => {
    if (!currentProgress || !sectionData) return

    const { completedClasses, completedExercises } = currentProgress
    const totalItems = (sectionData.sectionClasses?.length || 0) + (sectionData.sectionExercises?.length || 0)

    const completedItems = completedClasses.length + completedExercises.length

    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    setProgress(progressPercentage)
  }

  // Determine what content to show based on user progress
  const determineCurrentContent = (sectionData, prevContent) => {
    if (!currentProgress || !sectionData) return

    setCurrentContent(null)
    const { completedClasses, completedExercises } = currentProgress

    // Check if there are classes to complete
    if (sectionData.sectionClasses && sectionData.sectionClasses.length > 0) {
      // Find the first non-completed class
      const nextClassIndex = sectionData.sectionClasses.findIndex((cls) => {
        // Skip the class if it matches prevContent
        if (prevContent && prevContent._id === cls._id) {
          return false
        }
        // Skip the class if it's in completedClasses
        return !completedClasses.some((completedClass) => completedClass._id === cls._id)
      })

      if (nextClassIndex !== -1) {
        // Found a class to complete
        setCurrentContent(sectionData.sectionClasses[nextClassIndex])
        setContentType("class")
        return
      }
    }

    // If all classes are completed, move to exercises
    if (sectionData.sectionExercises && sectionData.sectionExercises.length > 0) {
      // Similar logic for exercises
      const nextExerciseIndex = sectionData.sectionExercises.findIndex((ex) => {
        // Skip the exercise if it matches prevContent
        if (prevContent && prevContent._id === ex._id) {
          return false
        }
        // Skip the exercise if it's in completedExercises
        return !completedExercises.some((completedExercise) => completedExercise.exerciseId === ex._id)
      })

      if (nextExerciseIndex !== -1) {
        setCurrentContent(sectionData.sectionExercises[nextExerciseIndex])
        setContentType("exercise")
        return
      }
    }

    // If all content is completed
    handleSectionCompleted(currentProgress._id)
  }

  const handleSectionCompleted = async (progressId) => {
    setContentType("section-completed")
    setProgress(100)
  }

  // Handle completion of current content
  const handleCompleteContent = async () => {
    if (!currentContent && contentType !== "section-completed") return

    setLoading(true)

    try {
      let response

      switch (contentType) {
        case "section-completed":
          await dispatch(advanceProgress(currentProgress._id)).unwrap()
          navigate(`/learn/modules/${moduleId}/levels/${levelId}`)
          return

        case "class":
          response = await dispatch(completeClass(currentContent._id)).unwrap()
          break

        default:
          return
      }

      if (response?.message === ADVANCE_SECTION) {
        navigate(`/learn/modules/${moduleId}/levels/${levelId}`)
      } else {
        await dispatch(fetchUserProgressById(moduleId)).unwrap()
        calculateProgress(section)
        determineCurrentContent(section, currentContent)
      }
    } catch (error) {
      console.error("Error completing content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteExercise = async (options) => {
    if (!currentContent) return

    setLoading(true)

    try {
      // Regular exercise
      const body = { userAnswers: options }

      const response = await dispatch(
        completeExercise({
          exerciseId: currentContent._id,
          body,
        }),
      ).unwrap()

      await dispatch(fetchUserProgressById(moduleId)).unwrap()
      calculateProgress(section)

      // Check if section is complete
      if (response?.message === ADVANCE_SECTION || response?.message === ADVANCE_LEVEL) {
        setContentType("section-completed")
      } else {
        // Determine next content
        determineCurrentContent(section, currentContent)
      }
    } catch (error) {
      console.error("Error completing exercise:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to render the appropriate content
  const renderContent = () => {
    if (!currentContent && contentType !== "section-completed") {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingPage />
        </div>
      )
    }

    if (contentType === "class") {
      return <SectionClass content={currentContent} advance={handleCompleteContent} />
    }

    if (contentType === "exercise") {
      return <Exercise content={currentContent} advance={handleCompleteExercise} />
    }

    if (contentType === "section-completed") {
      return (
        <div className="text-center mt-8">
          <div className="mb-4">
            <div className="h-20 w-20 bg-[#4558C8]/10 rounded-full flex items-center justify-center mx-auto">
              <div className="h-16 w-16 bg-[#4558C8]/20 rounded-full flex items-center justify-center">
                <div className="h-12 w-12 bg-[#4558C8] rounded-full flex items-center justify-center text-white">✓</div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-4">¡Sección completada!</h2>
          <p className="text-gray-500 mb-6">Has completado todos los contenidos de esta sección.</p>
          <button onClick={handleCompleteContent} className="bg-[#4558C8] text-white px-6 py-2 rounded-lg">
            Continuar
          </button>
        </div>
      )
    }

    return <div className="text-center mt-8">No hay contenido disponible</div>
  }

  if (loading)
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <LoadingPage />
      </div>
    )

  return (
    <div className="h-[90vh] bg-[#FAFAFA] pt-4 relative">
      <div className="flex">
        <div className="absolute left-4 top-4">
          <button
            className="flex items-center pl-4 z-10"
            onClick={() => navigate(`/learn/modules/${moduleId}/levels/${levelId}`)}
          >
            <img src={BackLogo || "/placeholder.svg"} alt="Back" className="h-4 mx-auto my-3" />
            <span className="ml-2">Salir</span>
          </button>
        </div>
        <div className="max-w-md mx-auto">
          <div className="flex border-[#E4E7EC] border-2 rounded-xl py-2 px-3">
            {courseImage[moduleId]?.image}
            <span className="ml-2 font-sans text-lg font-semibold">Sección {localStorage.getItem("sectionOrder")}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-md mx-auto mt-4 px-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#4558C8] h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="mt-8">{renderContent()}</div>
    </div>
  )
}

