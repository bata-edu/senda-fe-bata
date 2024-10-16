import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/exercise.css';

const Exercise = ({ question, options }) => {
  const navigate = useNavigate();

  return (
    <div className="exercise-container">
      <div className="header">
        <button className="close-button" onClick={() => navigate('/home')}>X</button>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <div className="heart-icon">❤️</div>
      </div>
      <div className="laptop-container">
        <div className="laptop-screen">
          <h2 className="question">{question}</h2>
          <div className="options">
            {options.map((option, index) => (
              <button key={index} className="option-button">
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
