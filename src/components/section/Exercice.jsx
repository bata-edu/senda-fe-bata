import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNextExercise,
  completeExercise,
} from "../../features/userProgress/userProgressSlice";
import LoadingPage from "../../pages/LoadingPage";
import "../../styles/exercise.css";
import { fetchExercise } from "../../features/section/sectionSlice";
import MultipleChoice from "../exercises/MultipleChoice";
import DragNDrop from "../exercises/DragNDrop";

const Exercise = ({ advance, completedExercise, loadingNextAction }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myExercise, currentProgress, nextAction } = useSelector(
    (state) => state.userProgress || {}
  );
  const { exercise } = useSelector((state) => state.section || {});
  const [loading, setLoading] = useState(true);
  const [childrenIndex, setChildrenIndex] = useState(0);
  const [isChildren, setIsChildren] = useState(false);
  const [exe, setExe] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  const selectedModule = localStorage.getItem("selectedModule");

  const courseColors = {
    "67190a2ecc62ee9e8f06c57b": {
      primary: "#D9B9F3",
      secondary: "#D9B9F3",
    },
    "67190a2ecc62ee9e8f06c57b": {
      primary: "#E0F47E",
      secondary: "#F6FCCB",
    },

    "67190a2ecc62ee9e8f06c57b": { primary: "#4558C8", secondary: "#7B97DF" },
    "67190a2ecc62ee9e8f06c57b": { primary: "#EE5E37", secondary: "#F9C5AF" },
  };

  useEffect(() => {
    if (!hasFetchedInitialData && currentProgress?.course) {
      const fetchInfo = async () => {
        await dispatch(fetchNextExercise(currentProgress.course));
        setCurrentExercise(completedExercise || myExercise);
        setHasFetchedInitialData(true);
      };

      fetchInfo();
    }
  }, [
    dispatch,
    currentProgress,
    completedExercise,
    myExercise,
    hasFetchedInitialData,
  ]);

  useEffect(() => {
    if (currentExercise) {
      parseExercise();
    }
  }, [currentExercise]);

  useEffect(() => {
    if (isChildren && exercise) {
      setExe(exercise);
      setLoading(false);
    }
  }, [exercise, isChildren]);

  const advanceExercise = async (option) => {
    if (!completedExercise) {
      if (isChildren) {
        if (option === exe?.answer) {
          setChildrenIndex(childrenIndex + 1);
          if (childrenIndex + 1 < currentExercise.childrens.length) {
            await dispatch(
              fetchExercise(currentExercise.childrens[childrenIndex + 1])
            );
            return;
          } else {
            setIsChildren();
            setFinal(currentExercise);
            return;
          }
        } else {
          return;
        }
      }
      const body = {
        userAnswer: option,
      };
      const exerciseId = myExercise.id;

      try {
        const response = await dispatch(completeExercise({ exerciseId, body }));
        if (!response || response.error) {
          return;
        }
        advance();
      } catch (error) {
        console.error("Error capturado:", error);
      }
    } else {
      if (isChildren) {
        if (option === exe?.answer) {
          setChildrenIndex(childrenIndex + 1);
          if (childrenIndex + 1 < currentExercise.childrens.length) {
            await dispatch(
              fetchExercise(currentExercise.childrens[childrenIndex + 1])
            );
            return;
          } else {
            setIsChildren();
            setFinal(currentExercise);
            return;
          }
        } else {
          return;
        }
      }
      advance();
    }
  };

  const parseExercise = async () => {
    if (currentExercise?.childrens.length) {
      if (childrenIndex < currentExercise.childrens.length) {
        await dispatch(fetchExercise(currentExercise.childrens[childrenIndex]));
        setIsChildren(true);
      } else {
        setIsChildren(false);
        setFinal(currentExercise);
      }
    } else {
      setFinal(currentExercise);
    }
  };

  const setFinal = (exerciseData) => {
    setExe(exerciseData);
    setLoading(false);
  };

  const handleCopy = (event) => {
    event.preventDefault();
  };

  return (
    <div className="exercise-container" onCopy={handleCopy}>
      {loading && (
        <div className="loading">
          <LoadingPage />
        </div>
      )}
      {!loading && (
        <div className="w-full">
          {exe.template === 1 ? (
            <MultipleChoice
              completedExercise={completedExercise}
              advance={advanceExercise}
              exercise={exe}
              colors={courseColors[selectedModule]}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default Exercise;
