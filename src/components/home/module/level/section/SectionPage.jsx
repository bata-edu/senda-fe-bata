"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  advanceProgress,
  completeClass,
  completeExercise,
  fetchUserProgressById,
} from "../../../../../features/userProgress/userProgressSlice"
import { fetchSection } from "../../../../../features/module/moduleSlice"
import SectionClass from "./class/Class"
import Exercise from "./exercise/Exercise"
import LoadingPage from "../../../../../pages/LoadingPage"
import BackLogo from "../../../../../assets/icons/back.png"
import { courseImageSectionPage as courseImage } from "../../../../../utils/courseImage"
import { ADVANCE_SECTION } from "../../../../../utils/constants"
import { GuideViewer } from "./Guide"

export const SectionPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { moduleId, levelId, sectionId } = useParams()
  const { currentProgress } = useSelector((state) => state.userProgress || {})
  const completedExercises = currentProgress?.completedExercises || []
  const [loading, setLoading] = useState(true)
  const [currentContent, setCurrentContent] = useState(null)
  const [contentType, setContentType] = useState(null)
  const [error, setError] = useState(null)
  const [sectionData, setSectionData] = useState(null)
  const [loadingMessage, setLoadingMessage] = useState("Cargando sección...")

  // Initial data loading
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (!moduleId || !levelId || !sectionId) return
      try {
        setLoading(true)
        setError(null)
        setLoadingMessage("Cargando datos del módulo...")
        
        // First check if we have the level data
        
        setLoadingMessage("Cargando progreso y contenido...")
        // Then fetch both user progress and section data in parallel
        const sectionResponse = await dispatch(fetchSection(sectionId)).unwrap()


        if (isMounted) {
          setSectionData(sectionResponse)
          setLoadingMessage("Preparando contenido...")
          // Wait for the next tick to ensure Redux store is updated
          setTimeout(() => {
            determineCurrentContent(sectionResponse)
          }, 0)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
        if (isMounted) {
          setError("Error al cargar el contenido de la sección")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      isMounted = false
    }
  }, [dispatch, moduleId, levelId, sectionId])

  // Handle progress updates
  useEffect(() => {
    if (sectionData && currentProgress) {
      determineCurrentContent(sectionData)
    }
  }, [currentProgress, sectionData])

  const determineCurrentContent = (sectionData, prevContent) => {
    if (!currentProgress || !sectionData) {
      return
    }

    setCurrentContent(null)
    const completedClasses = currentProgress?.completedClasses || []
    const completedExercises = currentProgress?.completedExercises || []

    // First check classes
    if (sectionData.sectionClasses?.length > 0) {
      const nextClassIndex = sectionData.sectionClasses.findIndex((cls) => {
        if (prevContent && prevContent._id === cls._id) {
          return false
        }
        return !completedClasses.some((completedClass) => completedClass._id === cls._id)
      })
      if (nextClassIndex !== -1) {
        setCurrentContent(sectionData.sectionClasses[nextClassIndex])
        setContentType("class")
        return
      }
    }

    // Then check exercises
    if (sectionData.sectionExercises?.length > 0) {
      // If we have a previous content and it's an exercise, try to find the next one
      if (prevContent && sectionData.sectionExercises.some(ex => ex._id === prevContent._id)) {
        const currentIndex = sectionData.sectionExercises.findIndex(ex => ex._id === prevContent._id)
        const nextExercise = sectionData.sectionExercises[currentIndex + 1]
        
        if (nextExercise) {
          setCurrentContent(nextExercise)
          setContentType("exercise")
          return
        }
      }

      // If we're at the end or starting fresh, check for incorrect exercises
      const incorrectExercises = sectionData.sectionExercises.filter((ex) => {
        const completedExercise = completedExercises.find(
          (completedExercise) => completedExercise.exerciseId === ex._id
        )
        return completedExercise && !completedExercise.isCorrect
      })

      if (incorrectExercises.length > 0) {
        // If we have incorrect exercises, start with the first one
        setCurrentContent(incorrectExercises[0])
        setContentType("exercise")
        return
      }

      // If no incorrect exercises, find the first uncompleted exercise
      const nextExerciseIndex = sectionData.sectionExercises.findIndex((ex) => {
        if (prevContent && prevContent._id === ex._id) {
          return false
        }
        return !completedExercises.some((completedExercise) => completedExercise.exerciseId === ex._id)
      })

      if (nextExerciseIndex !== -1) {
        setCurrentContent(sectionData.sectionExercises[nextExerciseIndex])
        setContentType("exercise")
        return
      }
    }

    // If all content is completed and correct, mark section as completed
    handleSectionCompleted(currentProgress._id)
  }

  const handleSectionCompleted = async (progressId) => {
    setContentType("section-completed")
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
        determineCurrentContent(sectionData, currentContent)
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

      console.log('Exercise completion response:', response)
      console.log('Current completed exercises:', completedExercises)

      // Fetch updated progress
      await dispatch(fetchUserProgressById(moduleId)).unwrap()

      if (response?.message === 'ADVANCE_SECTION') {
        handleSectionCompleted(currentProgress._id)
      } else if (response?.message === 'INCORRECT_EXERCISES') {
        const firstIncorrectExercise = response.incorrectExercises[0];
        const exercise = sectionData.sectionExercises.find(
          (ex) => ex._id === firstIncorrectExercise.exerciseId
        );
        if (exercise) {
          setCurrentContent(exercise);
          setContentType("exercise");
        }
      } else if (response?.message === 'CONTINUE') {
        // Find the next uncompleted exercise
        const nextExercise = sectionData.sectionExercises.find((ex) => {
          const completedExercise = completedExercises.find(
            (completedExercise) => completedExercise.exerciseId === ex._id
          )
          return !completedExercise && ex._id !== currentContent._id
        })

        if (nextExercise) {
          setCurrentContent(nextExercise)
          setContentType("exercise")
        }
      }
    } catch (error) {
      console.error("Error completing exercise:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to render the appropriate content
  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-[50vh]">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate(`/learn/modules/${moduleId}/levels/${levelId}`)}
            className="bg-[#4558C8] text-white px-6 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      )
    }

    if (!currentContent && contentType !== "section-completed") {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingPage message="Cargando contenido de la sección..." />
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

const renderProgress = () => {
  if (!sectionData) return null

  const totalClasses = sectionData.sectionClasses?.length || 0
  const completedClasses = currentProgress?.completedClasses.length || 0
  const totalExercises = sectionData.sectionExercises?.length || 0
  return (
    <div className="max-w-md mx-auto mt-4 px-4">
      {contentType === "class" && totalClasses > 0 && (
        <div className="flex gap-1">
          {[...Array(totalClasses)].map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-md ${
                index < completedClasses ? "bg-[#4558C8]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {contentType === "exercise" && totalExercises > 0 && (
        <div className="flex gap-1">
          {sectionData.sectionExercises.map((exercise, index) => {
            const completedExercise = completedExercises.find(
              (completedExercise) => completedExercise.exerciseId === exercise._id
            )
            const isCompleted = !!completedExercise
            const isCorrect = completedExercise?.isCorrect
            const isCurrent = currentContent?._id === exercise._id

            return (
              <div
                key={index}
                className={`h-2 flex-1 rounded-md relative ${
                  isCompleted
                    ? isCorrect === false
                      ? "bg-red-500"
                      : "bg-green-500"
                    : "bg-gray-300"
                } ${isCurrent ? "animate-bounce" : ""}`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

  if (loading) {
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <LoadingPage message={loadingMessage} />
      </div>
    )
  }

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
        <div className="max-w-md w-full justify-between mx-auto flex gap-2 items-center border-[#E4E7EC] border-2 rounded-xl py-2 px-2 sm:px-6">
          <div className="flex gap-2">
            {courseImage[moduleId]?.image}
            <span className="sfont-sans text-lg font-semibold">Sección {localStorage.getItem("sectionOrder")}</span>
          </div>
          {sectionData?.guide && (
            <GuideViewer 
              guide={sectionData.guide}
              icon
              text={"Ver guía"}
            />
          )}
        </div>
      </div>

      {/* Progress bar */}
      {renderProgress()}

      <div className="mt-8">{renderContent()}</div>
    </div>
  )
}

