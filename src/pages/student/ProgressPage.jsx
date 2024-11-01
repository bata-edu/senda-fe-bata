import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNextAction,
  resetNextAction,
} from "../../features/userProgress/userProgressSlice";
import {
  NEXT_CLASS,
  NEXT_EXERCISE,
  ADVANCE_SECTION,
  SUBMIT_FINAL_LEVEL_PROJECT,
  ADVANCE_LEVEL,
  COURSE_COMPLETED,
} from "../../utils/constants";
import SectionClass from "../../components/section/Class";
import Exercise from "../../components/section/Exercice";
import FinalWork from "../../components/level/FinalWork";
import LoadingPage from "../LoadingPage";
import { fetchUserProgress } from "../../features/userProgress/userProgressSlice";
import AdvanceSection from "../../components/section/AdvanceSection";
import AdvanceLevel from "../../components/section/AdvanceLevel";
import CompleteCourse from "../../components/section/CompleteCourse";
import { fetchSection } from "../../features/section/sectionSlice";

const ProgressPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { progress, nextAction, loading } = useSelector(
    (state) => state.userProgress || {}
  );
  const { section, loading: loadingSection } = useSelector(
    (state) => state.section || {}
  );
  const [searchParams] = useSearchParams();
  let sectionId = searchParams.get("section");
  let levelId = searchParams.get("level");
  let levelIndex = searchParams.get("index");
  const isCurrentSection = searchParams.get("current");
  const [completedClass, setCompletedClass] = useState(null);
  const [completedExercise, setCompletedExercise] = useState(null);
  const [loadingNextAction, setLoadingNextAction] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      await dispatch(fetchUserProgress());
    };
    if (!progress) {
      fetchProgress();
    } else {
      if (isCurrentSection === "true") {
        setLoadingNextAction(true);
        dispatch(fetchNextAction(progress.course));
        setLoadingNextAction(false);
      } else {
        dispatch(resetNextAction());
        if (sectionId) {
          getCompleteSection();
        }
        if (levelId) {
          setCompletedClass(null);
          setCompletedExercise(null);
        }
      }
    }
  }, [dispatch, progress]);

  const getCompleteSection = async () => {
    console.log(sectionId);
    const response = await dispatch(fetchSection(sectionId)).unwrap();
    setCompletedClass(response.sectionClasses[0]);
  };

  const handleAdvance = () => {
    if (isCurrentSection === "true") {
      setLoadingNextAction(true);
      dispatch(fetchNextAction(progress.course));
      setLoadingNextAction(false);
    } else {
      advanceCompletedSection();
    }
  };

  const advanceCompletedSection = async () => {
    if (advanceToNextClass()) return;
    if (advanceToNextExercise()) return;
    navigate("/home");
  };

  const advanceToNextClass = () => {
    if (completedClass && completedClass.next) {
      setCompletedClass(section.sectionClasses[completedClass.order]);
      return true;
    }
    return false;
  };

  const advanceToNextExercise = () => {
    setCompletedClass(null);
    if (!completedExercise) {
      setCompletedExercise(section.sectionExercises[0]);
      return true;
    } else {
      if (!completedExercise.next) {
        return false;
      } else {
        setCompletedExercise(section.sectionExercises[completedExercise.order]);
        return true;
      }
    }
  };

  return (
    <div>
      {(loading || loadingSection || loadingNextAction) && (
        <div className="loading">
          <LoadingPage />
        </div>
      )}
      <div>
        {(nextAction?.message === NEXT_CLASS || completedClass) && (
          <SectionClass
            advance={handleAdvance}
            completedClass={completedClass}
            loadingNextAction={loadingNextAction}
          />
        )}
        {(nextAction?.message === NEXT_EXERCISE || completedExercise) && (
          <Exercise
            advance={handleAdvance}
            completedExercise={completedExercise}
            loadingNextAction={loadingNextAction}
          />
        )}
        {(nextAction?.message === SUBMIT_FINAL_LEVEL_PROJECT || levelId) && (
          <FinalWork
            advance={handleAdvance}
            progress={progress}
            levelId={levelId}
            index={levelIndex}
            loadingNextAction={loadingNextAction}
          />
        )}
        {nextAction?.message === ADVANCE_SECTION && (
          <AdvanceSection
            advance={handleAdvance}
            loadingNextAction={loadingNextAction}
          />
        )}
        {nextAction?.message === ADVANCE_LEVEL && <AdvanceLevel />}
        {nextAction?.message === COURSE_COMPLETED && <CompleteCourse />}
      </div>
    </div>
  );
};

export default ProgressPage;
