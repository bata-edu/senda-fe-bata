import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/exercise.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchNextExercise, completeExercise } from '../../features/userProgress/userProgressSlice';
import LoadingPage from '../../pages/LoadingPage';

const Exercise = ({advance}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myExercise, progress, loading, nextAction } = useSelector((state) => state.userProgress || {});

  useEffect(() => {
    dispatch(fetchNextExercise(progress.course));
  }, [dispatch, nextAction]);

  const advanceExercise = async (option) => {
   const body =  {
    userAnswer: option,
   }
    const exerciseId = myExercise.id;
    await dispatch(completeExercise({exerciseId, body}));
    advance()
  }

  return (
    <div className="exercise-container">
    {loading && (
        <div className="loading">
          <LoadingPage />
        </div>
      )}
      <div className="header">
        <button className="close-button" onClick={() => navigate('/home')}>X</button>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <div className="heart-icon">❤️</div>
      </div>
      <div className="laptop-container">
        <div className="laptop-screen">
          <h2 className="question">{myExercise?.content}</h2>
          <div className="options">
            {myExercise?.options.map((option, index) => (
              <button key={index} className="option-button" onClick={() => advanceExercise(option)}>
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
