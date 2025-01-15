import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNextAction,
  fetchUserProgressById,
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
import AdvanceSection from "../../components/section/AdvanceSection";
import AdvanceLevel from "../../components/section/AdvanceLevel";
import CompleteCourse from "../../components/section/CompleteCourse";
import { fetchSection } from "../../features/section/sectionSlice";
import Header from "../../components/common/header/Header";
import Html from "../../assets/icons/html.svg";
import Python from "../../assets/icons/python.svg";
import BackLogo from "../../assets/icons/back.png";

const ProgressPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProgress, nextAction, loading } = useSelector(
    (state) => state.userProgress || {}
  );
  const { section, loading: loadingSection } = useSelector(
    (state) => state.section || {}
  );

  const selectedModule = localStorage.getItem("selectedModule");

  const courseImage = {
    Python: { image: <img src={Python} alt="Html logo" />, course: "Python" },
    "67190a2ecc62ee9e8f06c57b": {
      image: <img src={Html} alt="Html logo" />,
      course: "Html",
      backgroundCurrent: "#EE5E37",
      backgroundDone: "#F59D7C",
      borderCurrent: "#B72017",
      borderDone: "#EB4624",
      borderDisable: "#C8C8C8",
      barDone: "#EB4624",
      barCurrent: "#B72017",
      barUnfilled: "#F59D7C",
    },
    CSS: { image: <img src={Html} alt="Html logo" />, course: "Python" },
    "66fc2fb14c227e973f81b4d1": {
      image: <img src={Html} alt="Html logo" />,
      course: "Html",
      backgroundCurrent: "#EE5E37",
      backgroundDone: "#F59D7C",
      borderCurrent: "#B72017",
      borderDone: "#EB4624",
      borderDisable: "#C8C8C8",
      barDone: "#EB4624",
      barCurrent: "#B72017",
      barUnfilled: "#F59D7C",
    },
  };
  const [searchParams] = useSearchParams();
  let sectionId = searchParams.get("section");
  let levelId = searchParams.get("level");
  let levelIndex = searchParams.get("index");
  const isCurrentSection = searchParams.get("current");
  const [completedClass, setCompletedClass] = useState(null);
  const [completedExercise, setCompletedExercise] = useState(null);
  const [loadingNextAction, setLoadingNextAction] = useState(false);
  const sectionOrder = localStorage.getItem("sectionOrder");
  const sectionName = localStorage.getItem("sectionName");

  useEffect(() => {
    const fetchProgress = async () => {
      const moduleId = localStorage.getItem("selectedModule");
      await dispatch(fetchUserProgressById(moduleId));
    };
    if (!currentProgress) {
      fetchProgress();
    } else {
      if (isCurrentSection === "true") {
        setLoadingNextAction(true);
        dispatch(fetchNextAction(currentProgress.course));
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
  }, [dispatch, currentProgress]);

  const getCompleteSection = async () => {
    const response = await dispatch(fetchSection(sectionId)).unwrap();
    setCompletedClass(response.sectionClasses[0]);
  };

  const handleAdvance = () => {
    if (isCurrentSection === "true") {
      setLoadingNextAction(true);
      dispatch(fetchNextAction(currentProgress.course));
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
    <>
      <Header />
      <div className=" h-[90vh] bg-[#FAFAFA] pt-4">
        {(loading || loadingSection || loadingNextAction) && (
          <div className="loading">
            <LoadingPage />
          </div>
        )}
        <div className="w-full flex ">
          <div className="w-12">
            <button
              className="flex items-center pl-4"
              onClick={() => navigate("/learn/modules")}
            >
              <img
                src={BackLogo}
                alt="Back Bata"
                className="h-4 mx-auto my-3"
              />
              <span className="ml-2">Salir</span>
            </button>
          </div>
          <div className="w-full -ml-12">
            <div className="flex border-[#E4E7EC] border-2 rounded-xl py-2 px-3 w-1/3 mx-auto">
              {courseImage[selectedModule]?.image}
              <span className="ml-2 font-sans text-lg font-semibold">
                Seccion {sectionOrder}: {sectionName}
              </span>
            </div>
          </div>
        </div>
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
              progress={currentProgress}
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
    </>
  );
};

export default ProgressPage;
