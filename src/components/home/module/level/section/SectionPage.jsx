"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  advanceProgress,
  completeClass,
  completeExercise,
  fetchUserSectionProgress,
  determineNextContent,
  selectNextContent,
  selectContentType,
  selectSectionCompleted,
  selectIsLoading,
  selectCurrentSection,
  selectReviewingIncorrectExercises,
  // selectAllExercisesAttempted,
  fetchUserProgress,
} from "../../../../../features/userProgress/userProgressSlice"
import {
  fetchModules,
  fetchSections,
  fetchExercisesAndClasses,
  fetchLevels,
} from "../../../../../features/module/moduleSlice"
import SectionClass from "./class/Class"
import Exercise from "./exercise/Exercise"
import LoadingPage from "../../../../../pages/LoadingPage"
import BackLogo from "../../../../../assets/icons/back.png"
import { courseImageSectionPage as courseImage } from "../../../../../utils/courseImage"
import { GuideViewer } from "./Guide"

export const SectionPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { moduleSlug, levelId, sectionId } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sectionData, setSectionData] = useState(null)

  // Use selectors to get state from Redux
  const isLoadingSection = useSelector(selectIsLoading)
  const { modules } = useSelector((state) => state.modules)
  const { progress } = useSelector((state) => state.userProgress)
  const currentSection = useSelector(selectCurrentSection)
  const currentContent = useSelector(selectNextContent)
  const contentType = useSelector(selectContentType)
  const sectionCompleted = useSelector(selectSectionCompleted)
  const reviewingIncorrectExercises = useSelector(selectReviewingIncorrectExercises)
  // const allExercisesAttempted = useSelector(selectAllExercisesAttempted)

  const modulesLoaded = useRef(false)
  const levelsLoaded = useRef(false)
  const sectionsLoaded = useRef(false)
  const progressLoaded = useRef(false)
  const exercisesAndClassesLoaded = useRef(false)

  // Load all data needed (modules, sections, progress)
  useEffect(() => {
    if (!moduleSlug || !levelId || !sectionId) return
    const loadData = async () => {
      try {
        // Load modules if not loaded
        if (!modules || !modules[moduleSlug]) {
          console.log("Fetching modules")
          await dispatch(fetchModules()).unwrap()
          modulesLoaded.current = true
          return
        }
        // Load levels if not loaded
        if (modules && modules[moduleSlug] && !modules[moduleSlug].levels && !levelsLoaded.current) {
          console.log("Fetching levels")
          await dispatch(fetchLevels(moduleSlug)).unwrap()
          levelsLoaded.current = true
          return
        }
        // Load sections if not loaded
        if (modules && modules[moduleSlug] && !modules[moduleSlug].levels[levelId].sections && !sectionsLoaded.current) {
          console.log("Fetching sections")
          await dispatch(fetchSections(levelId)).unwrap()
          sectionsLoaded.current = true
          return
        }
        // Load exercises and classes if not loaded
        if (
          modules &&
          modules[moduleSlug] &&
          modules[moduleSlug].levels[levelId].sections[sectionId] &&
          !sectionData &&
          !exercisesAndClassesLoaded.current
        ) {
          const sectionDataFromStore = modules[moduleSlug].levels[levelId].sections[sectionId]
          setSectionData(sectionDataFromStore)
          await dispatch(fetchExercisesAndClasses({levelId, sectionId})).unwrap()
          exercisesAndClassesLoaded.current = true
          return
        }
        if (!progress) {
          console.log("Fetching general progress")
          dispatch(fetchUserProgress())
          return;
        }
        if (!progress || !currentSection || !currentSection.progress) {
          setSectionData(modules[moduleSlug].levels[levelId].sections[sectionId])
          console.log("Fetching section progress")
          await dispatch(
            fetchUserSectionProgress({
              courseId: moduleSlug,
              levelId,
              sectionId,
            }),
          ).unwrap()
          progressLoaded.current = true
          return
        }
        setLoading(false)
      } catch (err) {
        console.error("Error cargando datos iniciales:", err)
        setError("Error cargando los datos de la sección.")
      }
    }

    loadData()
  }, [dispatch, moduleSlug, levelId, sectionId, currentSection, sectionData, modules])

  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    if (!initialized && sectionData && currentSection) {
      console.log("Determinando contenido")
      dispatch(determineNextContent({ sectionData }))
      setInitialized(true)
    }
  }, [sectionData, currentSection, dispatch, initialized])

  const handleCompleteContent = async () => {
    if (contentType === "section-completed") {
      try {
        await dispatch(advanceProgress({progressId: progress[moduleSlug]._id, sectionId})).unwrap()
        dispatch(fetchUserProgress())
        navigate(`/learn/modules/${moduleSlug}/levels/${levelId}`)
      } catch (err) {
        console.error("Error advancing progress:", err)
      }
      return
    }

    if (!currentContent) return

    try {
      if (contentType === "class") {
        console.log("Completando clase")
        await dispatch(
          completeClass({
            moduleSlug,
            classId: currentContent._id,
          }),
        ).unwrap()

        // After completing a class, determine the next content
        dispatch(determineNextContent({ sectionData }))
      }
    } catch (err) {
      console.error("Error completando contenido:", err)
    }
  }

  const handleCompleteExercise = async (userAnswers) => {
    if (!currentContent) return
    try {
      dispatch(
        completeExercise({
          moduleSlug,
          exerciseId: currentContent._id,
          body: { userAnswers },
        }),
      )

      // After completing an exercise, determine the next content
      dispatch(determineNextContent({ sectionData }))
    } catch (err) {
      console.error("Error completando ejercicio:", err)
    }
  }

  const renderProgress = () => {
    if (!sectionData || !currentSection?.progress) return null

    const completedClasses = currentSection?.progress?.completedClasses || []
    const completedExercises = currentSection?.progress?.completedExercises || []

    const totalClasses = sectionData.classes?.length || 0
    const totalExercises = sectionData.exercises?.length || 0

    return (
      <div className="max-w-md mx-auto mt-4 px-4">
        {contentType === "class" && totalClasses > 0 && (
          <div className="flex gap-1">
            {[...Array(totalClasses)].map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-md ${index < completedClasses.length ? "bg-[#4558C8]" : "bg-gray-300"}`}
              />
            ))}
          </div>
        )}

        {contentType === "exercise" && totalExercises > 0 && (
          <div className="flex flex-col gap-2">
            {reviewingIncorrectExercises && (
              <div className="text-center text-sm text-amber-600">Revisando ejercicios incorrectos</div>
            )}
            <div className="flex gap-1">
              {sectionData.exercises.map((exercise, index) => {
                const completed = completedExercises.find((e) => e.exerciseId === exercise._id)
                const isCompleted = !!completed
                const isCorrect = completed?.isCorrect
                const isCurrent = currentContent?._id === exercise._id

                return (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-md ${
                      isCompleted ? (isCorrect === false ? "bg-red-500" : "bg-green-500") : "bg-gray-300"
                    } ${isCurrent ? "animate-bounce" : ""}`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-[50vh]">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(`/learn/modules/${moduleSlug}/levels/${levelId}`)}
            className="bg-[#4558C8] text-white px-6 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      )
    }

    if (isLoadingSection) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingPage message="Cargando contenido de la sección..." />
        </div>
      )
    }

    if (contentType === "class" && currentContent) {
      return <SectionClass content={currentContent} advance={handleCompleteContent} />
    }

    if (contentType === "exercise" && currentContent) {
      return <Exercise content={currentContent} advance={handleCompleteExercise} />
    }

    if (contentType === "section-completed" || sectionCompleted) {
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

  if (loading) {
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <LoadingPage />
      </div>
    )
  }

  return (
    <div className="h-[90vh] bg-[#FAFAFA] pt-4 relative">
      <div className="flex">
        <div className="absolute left-4 top-4">
          <button
            className="flex items-center pl-4 z-10"
            onClick={() => navigate(`/learn/modules/${moduleSlug}/levels/${levelId}`)}
          >
            <img src={BackLogo || "/placeholder.svg"} alt="Back" className="h-4 mx-auto my-3" />
            <span className="ml-2">Salir</span>
          </button>
        </div>
        <div className="max-w-md w-full justify-between mx-auto flex gap-2 items-center border-[#E4E7EC] border-2 rounded-xl py-2 px-2 sm:px-6">
          <div className="flex gap-2">
            {courseImage[moduleSlug]?.image}
            <span className="font-sans text-lg font-semibold">Sección {localStorage.getItem("sectionOrder")}</span>
          </div>
          {sectionData?.guide && <GuideViewer guide={sectionData.guide} icon text="Ver guía" />}
        </div>
      </div>

      {renderProgress()}

      <div className="mt-8">{renderContent()}</div>
    </div>
  )
}

export default SectionPage

