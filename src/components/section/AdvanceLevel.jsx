import React from 'react';
import '../../styles/advanceSection.css';
import robotImage from '../../assets/robot.png';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { advanceCourse } from '../../features/userProgress/userProgressSlice';

const AdvanceLevel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleAdvanceLevel = async () => {
    await dispatch(advanceCourse());
    navigate('/home');
  };

  return (
    <div className="advance-section-container">
      <h2 className="message">¡Felicidades! Has completado el nivel.</h2>
      
      <button className="next-button" onClick={handleAdvanceLevel}>
        Avanzar al siguiente nivel
      </button>

      <div className="robot-container-section">
        <img src={robotImage} alt="Robot" className="robot-image-section" />
      </div>
    </div>
  );
};

export default AdvanceLevel;
