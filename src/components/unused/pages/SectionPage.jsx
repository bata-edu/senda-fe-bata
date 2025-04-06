import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  advanceProgress,
  completeClass,
  completeExercise,
  fetchUserProgress,
  // fetchUserProgressById,
} from "../../../features/userProgress/userProgressSlice";
// import { fetchSections } from "../../../features/module/moduleSlice";
import SectionClass from "../../components/section/Class";
import Exercise from "../../components/section/Exercice";
import LoadingPage from "../../../pages/LoadingPage";
import BackLogo from "../../assets/icons/back.png";
import { courseImageSectionPage as courseImage } from "../../../utils/courseImage";
import {
  ADVANCE_LEVEL,
  ADVANCE_SECTION,
  NEXT_CLASS,
} from "../../../utils/constants";

export const SectionPage = () => {
  const navigate = useNavigate()
  const { moduleId, levelId, sectionId } = useParams()
  const dispatch = useDispatch()

  // Redux state
  const { currentProgress, loading: progressLoading } = useSelector((state) => state.userProgress || {})
  const { section, loading: sectionLoading } = useSelector((state) => state.section || {})

  // Local state
  const [loading, setLoading] = useState(true)
  const [currentContent, setCurrentContent] = useState(null)
  const [contentType, setContentType] = useState(null) // "class" or "exercise" or "section-completed"
  const [progress, setProgress] = useState(0)

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      if (!moduleId || !levelId || !sectionId) return;

      try {
        setLoading(true);

        // Fetch user progress
        // await dispatch(fetchUserProgressById(moduleId)).unwrap();

        // Fetch section data
        // const sectionData = await dispatch(fetchSection(sectionId)).unwrap()

        // Calculate progress
        calculateProgress(sectionData)

        // Determine current content based on user progress
        determineCurrentContent(sectionData)
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setLoading(false)
      }
    };

    loadInitialData();
  }, [dispatch, moduleId, levelId, sectionId]);

  // Determine what content to show based on user progress
  const determineCurrentContent = (sectionData, prevContent) => {
    if (!currentProgress) return;
    setCurrentContent(null);
    const { completedClasses, completedExercises } = currentProgress;
    // Check if there are classes to complete
    if (sectionData.sectionClasses && sectionData.sectionClasses.length > 0) {
      console.log("Searching class");
      // Find the first non-completed class
      const nextClassIndex = sectionData.sectionClasses.findIndex((cls) => {
        // Skip the class if it matches prevContent
        if (prevContent && prevContent._id === cls._id) {
          return false;
        }
        // Skip the class if it's in completedClasses
        return !completedClasses.some(
          (completedClass) => completedClass._id === cls._id
        );
      });

      if (nextClassIndex !== -1) {
        // Found a class to complete
        setLoading(false);
        setCurrentContent(sectionData.sectionClasses[nextClassIndex]);
        setContentType("class");
        return;
      } else {
        console.log("No next class found");
      }
    }

    }

    // If all classes are completed, move to exercises
    if (
      sectionData.sectionExercises &&
      sectionData.sectionExercises.length > 0
    ) {
      console.log("Searching exercise");
      // Similar logic for exercises
      const nextExerciseIndex = sectionData.sectionExercises.findIndex((ex) => {
        // Skip the class if it matches prevContent
        if (prevContent && prevContent._id === ex._id) {
          return false;
        }
        // Skip the class if it's in completedClasses
        return !completedExercises.some(
          (completedExercise) => completedExercise.exerciseId === ex._id
        );
      });
      console.log(nextExerciseIndex);
      if (nextExerciseIndex !== -1) {
        setLoading(false);
        setCurrentContent(sectionData.sectionExercises[nextExerciseIndex]);
        setContentType("exercise");
        return;
      }
    }
    console.log("Section completed");

    handleSectionCompleted(currentProgress._id);
    setLoading(false);
  };

  const handleSectionCompleted = async (progressId) => {
    await dispatch(advanceProgress(progressId)).unwrap;
    setContentType("section-completed");
  };
  // Handle completion of current content
  const handleCompleteContent = async () => {
    if (!currentContent || !contentType) return;
    setCurrentContent(null);
    setLoading(true);
    try {
      let response

      switch (contentType) {
        case "section-completed":
          await dispatch(advanceProgress(currentProgress._id)).unwrap();
          navigate(`/learn/modules/${moduleId}/levels/${levelId}`);
          return;
        case "class":
          console.log(contentType);
          response = await dispatch(completeClass({ moduleId, classId: currentContent._id })).unwrap();
          break;
        default:
          return
      }

      if (response?.message === ADVANCE_SECTION) {
        navigate(`/learn/modules/${moduleId}/levels/${levelId}`)
      } else {
        // await dispatch(fetchUserProgressById(moduleId)).unwrap();
        determineCurrentContent(section, currentContent);
        // Small delay to ensure state updates are processed
        return; // Return early to avoid setting loading to false twice
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
      const body = { userAnswer: option };

      const response = await dispatch(
        completeExercise({ exerciseId: currentContent._id, body })
      ).unwrap();
      // await dispatch(fetchUserProgressById(moduleId)).unwrap();

      // Check if section is complete
      if (
        response?.message === ADVANCE_SECTION ||
        response.message === ADVANCE_LEVEL
      ) {
        setContentType("section-completed");
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
      return <LoadingPage></LoadingPage>;
    }

    if (contentType === "class") {
      return (
        <SectionClass
          advance={handleCompleteContent}
          content={currentContent}
        />
      );
    } else if (contentType === "exercise") {
      return (
        <Exercise advance={handleCompleteExercise} content={currentContent} />
      );
    } else if (contentType === "section-completed") {
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
      );
    }
    return <div className="text-center mt-8">No hay contenido disponible</div>;
  };

  if (loading)
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <LoadingPage />
      </div>
    );

  return (
    <div className="h-[90vh] bg-[#FAFAFA] pt-4 relative">
      <div className="flex">
        <div className="absolute left-4 top-4">
          <button
            className="flex items-center pl-4 z-10"
            onClick={() =>
              navigate(`/learn/modules/${moduleId}/levels/${levelId}`)
            }
          >
            <img src={BackLogo || "/placeholder.svg"} alt="Back" className="h-4 mx-auto my-3" />
            <span className="ml-2">Salir</span>
          </button>
        </div>
        <div className="max-w-md mx-auto">
          <div className="flex border-[#E4E7EC] border-2 rounded-xl py-2 px-3 items-center">
            {courseImage[moduleId]?.image}
            <span className="ml-2 font-sans text-lg font-semibold h-min">
              Sección {localStorage.getItem("sectionOrder")}
            </span>
          </div>
        </div>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};
