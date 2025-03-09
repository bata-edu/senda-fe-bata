import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { advanceProgress, completeClass, completeExercise, fetchUserProgressById } from "../../features/userProgress/userProgressSlice";
import { fetchSection } from "../../features/section/sectionSlice";
import SectionClass from "../../components/section/Class";
import Exercise from "../../components/section/Exercice";
import LoadingPage from "../LoadingPage";
import BackLogo from "../../assets/icons/back.png";
import { courseImageSectionPage as courseImage } from "../../utils/courseImage";
import { ADVANCE_LEVEL, ADVANCE_SECTION } from "../../utils/constants";

export const SectionPage = () => {
  const navigate = useNavigate();
  const { moduleId, levelId, sectionId } = useParams();
  const dispatch = useDispatch();
  
  const { currentProgress, loading: progressLoading } = useSelector(
    (state) => state.userProgress || {}
  );
  const { section, loading: sectionLoading } = useSelector(
    (state) => state.section || {}
  );

  const [loading, setLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState(null);
  const [contentType, setContentType] = useState(null); // "class" or "exercise"

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      if (!moduleId || !levelId || !sectionId) return;
      
      try {
        setLoading(true);
        
        // Fetch user progress
        await dispatch(fetchUserProgressById(moduleId)).unwrap();
        
        // Fetch section data
        const sectionData = await dispatch(fetchSection(sectionId)).unwrap();
        // Determine current content based on user progress
        determineCurrentContent(sectionData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [dispatch, moduleId, levelId, sectionId]);

  // Determine what content to show based on user progress
  const determineCurrentContent = (sectionData) => {
    console.log(sectionData)
    if (!sectionData || !currentProgress) return;
    
    const { completedClasses = [] } = currentProgress;
    
    // Check if there are classes to complete
    if (sectionData.sectionClasses && sectionData.sectionClasses.length > 0) {
      // Find the first non-completed class
      const nextClassIndex = sectionData.sectionClasses.findIndex(
        cls => !completedClasses.includes(cls._id)
      );
      
      if (nextClassIndex !== -1) {
        // Found a class to complete
        setCurrentContent(sectionData.sectionClasses[nextClassIndex]);
        setContentType("class");
        return;
      }
    };
    
    // If all classes are completed, move to exercises
    if (sectionData.sectionExercises && sectionData.sectionExercises.length > 0) {
      // Similar logic for exercises
      const completedExercises = currentProgress.completedExercises || [];
      const nextExerciseIndex = sectionData.sectionExercises.findIndex(
        ex => !completedExercises.includes(ex._id)
      );
      
      if (nextExerciseIndex !== -1) {
        setCurrentContent(sectionData.sectionExercises[nextExerciseIndex]);
        setContentType("exercise");
        return;
      }
    };

    handleSectionCompleted(currentProgress._id)
  };

  const handleSectionCompleted = ( progressId ) => {
    dispatch(advanceProgress(progressId))
    setContentType("section-completed")
  }
  // Handle completion of current content
  const handleCompleteContent = async () => {
    if (!currentContent || !contentType) return;
    
    setLoading(true);

    try {
      let response;
      if (contentType === "section-completed") {
        dispatch(advanceProgress(currentProgress._id))
        navigate(`/learn/modules/${moduleId}/levels/${levelId}`);
      }
      else if (contentType === "class") {
        response = dispatch(completeClass(currentContent._id))
      } else {
        console.error("Endpoint not found for", contentType)
      }
      await dispatch(fetchUserProgressById(moduleId)).unwrap();
      if (response.message === ADVANCE_SECTION) {
        navigate(`/learn/modules/${moduleId}/levels/${levelId}`);
      } else {
        determineCurrentContent(section);
      }
    } catch (error) {
      console.error("Error completing content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteExercise = async (option) => {
    if (!currentContent) return;
    setLoading(true);
    try {
      // Regular exercise
      const body = { userAnswer: option };
      
      const response = await dispatch(
        completeExercise({ exerciseId: currentContent._id, body })
      ).unwrap();
      console.log(response);
      
      await dispatch(fetchUserProgressById(moduleId)).unwrap();
      
      // Check if section is complete
      if (response?.message === ADVANCE_SECTION || response.message === ADVANCE_LEVEL) {
        setContentType("section-completed")
      } else {
        // Determine next content
        determineCurrentContent(section);
      }
    } catch (error) {
      console.error("Error avanzando ejercicio:", error);
    } finally {
      setLoading(false);
    }
  };
  // Function to render the appropriate content
  const renderContent = () => {
    if (!currentContent && contentType !== "section-completed" ) {
      return (
        <LoadingPage></LoadingPage>
      )
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
        <Exercise 
          advance={handleCompleteExercise} 
          content={currentContent}
        />
      );
    } else if (contentType === "section-completed") {
      return (
        <div className="text-center mt-8">
          <h2 className="text-xl font-bold mb-4">¡Sección completada!</h2>
          <button
            onClick={handleCompleteContent}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Continuar
          </button>
        </div>
      )
    }    
    return <div className="text-center mt-8">No hay contenido disponible</div>;
  };

  if (loading) return(
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
            <img src={BackLogo} alt="Back" className="h-4 mx-auto my-3" />
            <span className="ml-2">Salir</span>
          </button>
        </div>
        <div className="max-w-md mx-auto">
          <div className="flex border-[#E4E7EC] border-2 rounded-xl py-2 px-3">
            {courseImage[moduleId]?.image}
            <span className="ml-2 font-sans text-lg font-semibold">
              Sección {localStorage.getItem("sectionOrder")}
            </span>
          </div>
        </div>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};