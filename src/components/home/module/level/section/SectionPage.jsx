"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  advanceProgress,
  completeClass,
  completeExercise,
  fetchUserSectionProgress
} from "../../../../../features/userProgress/userProgressSlice"
import {
  fetchModules,
  fetchSections,
  fetchExercisesAndClasses,
  fetchLevels
} from "../../../../../features/module/moduleSlice"
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

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentContent, setCurrentContent] = useState(null)
  const [contentType, setContentType] = useState(null)
  const [sectionData, setSectionData] = useState(null)

  const { loadingCurrentSection } = useSelector((state) => state.userProgress || {})
  const { modules } = useSelector((state) => state.modules)
  const { currentSection } = useSelector((state) => state.userProgress || {})
  const modulesLoaded = useRef(false)
  const levelsLoaded = useRef(false)
  const sectionsLoaded = useRef(false)
  const progressLoaded = useRef(false)
  const exercisesAndClassesLoaded = useRef(false)

  // Load all data needed (modules, sections, progress)
  useEffect(() => {
    if (!moduleId || !levelId || !sectionId) return;
    const loadData = async () => {
      try {
        // Load modules if not loaded
        if (!modules || !modules[moduleId]) {
          console.log("Fetching modules")
          await dispatch(fetchModules()).unwrap()
          modulesLoaded.current = true
          return;
        }
        // Load levels if not loaded
        if (modules && modules[moduleId] && !modules[moduleId].levels && !levelsLoaded.current) {
          console.log("Fetching levels")
          await dispatch(fetchLevels(moduleId)).unwrap()
          levelsLoaded.current = true
          return;
        }
        // Load sections if not loaded
        if (modules && modules[moduleId] && !modules[moduleId].levels[levelId].sections && !sectionsLoaded.current) {
          console.log("Fetching sections")
          await dispatch(fetchSections(levelId)).unwrap()
          sectionsLoaded.current = true
          return;
        }
        // Load exercises and classes if not loaded
        if (modules && modules[moduleId] && modules[moduleId].levels[levelId].sections[sectionId] && !sectionData && !exercisesAndClassesLoaded.current) {
          await dispatch(fetchExercisesAndClasses(sectionId)).unwrap()
          exercisesAndClassesLoaded.current = true
          return;
        }
        if (!currentSection || !currentSection.progress) {
          setSectionData(modules[moduleId].levels[levelId].sections[sectionId])
          console.log("Fetching progress")
          await dispatch(fetchUserSectionProgress({
            courseId: moduleId,
            levelId,
            sectionId
          })).unwrap()
          progressLoaded.current = true
          return;
        }
        setLoading(false)
      } catch (err) {
        console.error("Error cargando datos iniciales:", err)
        setError("Error cargando los datos de la sección.")
      }
    }

    loadData()
  }, [dispatch, moduleId, levelId, sectionId, currentSection, sectionData, modules])

  // Cuando tengamos sección y progreso, determinamos el contenido
  useEffect(() => {
    if (sectionData && currentSection) {
      console.log("Determinando contenido")
      determineCurrentContent()
    }
  }, [sectionData, currentSection])

  const determineCurrentContent = () => {
    setCurrentContent(null)
    const completedClasses = currentSection?.progress?.completedClasses
    const completedExercises = currentSection?.progress?.completedExercises

    console.log(completedClasses)
    console.log(sectionData.classes)
    if (sectionData.classes.length > completedClasses.length) {
      const classToDo = sectionData.classes[completedClasses.length]
      console.log(classToDo)
      setCurrentContent(classToDo)
      setContentType("class")
      return;
    }
  
    const incorrectExercises = sectionData.exercises?.filter((ex) => {
      const completed = completedExercises.find((done) => done.exerciseId === ex._id)
      return completed && !completed.isCorrect
    })
  
    if (incorrectExercises.length > 0) {
      setCurrentContent(incorrectExercises[0])
      setContentType("exercise")
      return
    }
  
    const nextExercise = sectionData.exercises?.find((ex) =>
      !completedExercises.some((done) => done.exerciseId === ex._id)
    )
  
    if (nextExercise) {
      setCurrentContent(nextExercise)
      setContentType("exercise")
      return
    }
  
    handleSectionCompleted(currentSection?._id)
  }

  const handleCompleteContent = async () => {
    if (!currentContent && contentType !== "section-completed") return
    setLoading(true)
  
    const sectionProgress = currentSection
  
    try {
      if (contentType === "class") {
        console.log("Completando clase")
        await dispatch(completeClass({ moduleId, classId: currentContent._id })).unwrap();
      } else if (contentType === "exercise") {
        await dispatch(completeExercise({ moduleId, exerciseId: currentContent._id })).unwrap();
      } else if (contentType === "section-completed") {
        await dispatch(advanceProgress(sectionProgress._id)).unwrap()
        navigate(`/learn/modules/${moduleId}/levels/${levelId}`)
        return
      }
    } catch (err) {
      console.error("Error completando contenido:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionCompleted = async (sectionId) => {
    setContentType("section-completed")
  }
  

  const handleCompleteExercise = async (options) => {
    if (!currentContent) return
    setLoading(true)

    try {
      await dispatch(
        completeExercise({
          moduleId,
          exerciseId: currentContent._id,
          body: { userAnswers: options },
        })
      ).unwrap()




      handleSectionCompleted(currentSection.sectionId)

    } catch (err) {
      console.error("Error completando ejercicio:", err)
    } finally {
      setLoading(false)
    }
  }

  const renderProgress = () => {
    if (!sectionData) return null
  
    const completedClasses = currentSection?.progress?.completedClasses
    const completedExercises = currentSection?.progress?.completedExercises
  
    const totalClasses = sectionData.classes?.length || 0
    const totalExercises = sectionData.exercises?.length || 0
  
    return (
      <div className="max-w-md mx-auto mt-4 px-4">
        {contentType === "class" && totalClasses > 0 && (
          <div className="flex gap-1">
            {[...Array(totalClasses)].map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-md ${
                  index < completedClasses.length ? "bg-[#4558C8]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
  
        {contentType === "exercise" && totalExercises > 0 && (
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

    if (loadingCurrentSection) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingPage message="Cargando contenido de la sección..." />
        </div>
      )
    }
    // if (!currentContent && contentType !== "section-completed") {
    //   return (
    //     <div className="flex justify-center items-center h-[50vh]">
    //       <LoadingPage message="Cargando contenido de la sección..." />
    //     </div>
    //   )
    // }

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
            onClick={() => navigate(`/learn/modules/${moduleId}/levels/${levelId}`)}
          >
            <img src={BackLogo || "/placeholder.svg"} alt="Back" className="h-4 mx-auto my-3" />
            <span className="ml-2">Salir</span>
          </button>
        </div>
        <div className="max-w-md w-full justify-between mx-auto flex gap-2 items-center border-[#E4E7EC] border-2 rounded-xl py-2 px-2 sm:px-6">
          <div className="flex gap-2">
            {courseImage[moduleId]?.image}
            <span className="font-sans text-lg font-semibold">Sección {localStorage.getItem("sectionOrder")}</span>
          </div>
          {sectionData?.guide && (
            <GuideViewer guide={sectionData.guide} icon text="Ver guía" />
          )}
        </div>
      </div>

      {renderProgress()}

      <div className="mt-8">{renderContent()}</div>
    </div>
  )
}
