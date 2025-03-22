import React from 'react';
import '../../styles/advanceSection.css';
import robotImage from '../../../../assets/robot.png';
import { useDispatch } from 'react-redux';
import { advanceCourse } from '../../features/userProgress/userProgressSlice';
import { useNavigate } from 'react-router-dom';

const CompleteCourse = ({ finish }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinishCourse = async () => {
    await dispatch(advanceCourse());
    navigate('/home');
  };

  return (
    <div className="advance-section-container">
      <h2 className="message">¡Felicidades! Has completado el curso.</h2>
      
      <button className="next-button" onClick={handleFinishCourse}>
        Finalizar curso
      </button>

      <div className="robot-container-section">
        <img src={robotImage} alt="Robot" className="robot-image-section" />
      </div>
    </div>
  );
};

export default CompleteCourse;
