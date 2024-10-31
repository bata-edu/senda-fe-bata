import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNextExercise,
  completeExercise,
} from "../../features/userProgress/userProgressSlice";
import LoadingPage from "../../pages/LoadingPage";
import "../../styles/exercise.css";

const Exercise = ({ advance, completedExercise, loadingNextAction }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myExercise, progress, nextAction } = useSelector(
    (state) => state.userProgress || {}
  );

  useEffect(() => {
    if (!completedExercise || !loadingNextAction) {
      dispatch(fetchNextExercise(progress.course));
    }
  }, [dispatch, nextAction]);

  const advanceExercise = async (option) => {
    if (!completedExercise) {
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
      advance();
    }
  };

  const currentExercise = completedExercise || myExercise;
  const answer = currentExercise?.answer;

  return (
    <div className="exercise-container">
      {!myExercise && !progress && (
        <div className="loading">
          <LoadingPage />
        </div>
      )}
      <div className="header">
        <button className="close-button" onClick={() => navigate("/home")}>
          X
        </button>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <div className="heart-icon">❤️</div>
      </div>
      <div className="laptop-container">
        <div className="laptop-screen">
          <h2 className="question">{currentExercise?.content}</h2>
          <div className="options">
            {currentExercise?.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  option === answer ? "correct-answer" : ""
                }`}
                onClick={() => advanceExercise(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
