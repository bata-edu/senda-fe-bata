import React from 'react';
import '../../styles/levels.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Levels = () => {

  const navigate = useNavigate();

  const { levels = [], module } = useSelector((state) => state.level || {});
  const { progress } = useSelector((state) => state.userProgress || {});

  const currentLevelOrder = levels.find((level) => level.id === progress.currentLevel)?.order || 0;

  const navigateToLevel = (levelId) => {
    navigate(`/home#${levelId}`);
  };

  return (
    <div className="levels-page">
      <h2>{module.name}</h2>
      <div className="levels-container">
        <div className="levels-grid">
          {levels.map((level) => (
            <div 
              key={level._id} 
              className={`level 
                ${level.order < currentLevelOrder ? 'active' : ''}
                ${level.order === currentLevelOrder ? 'current' : ''}
                ${level.order > currentLevelOrder ? 'disabled' : ''}`}
              onClick={() => navigateToLevel(level.id)}
            >
              NIVEL {level.order}
            </div>
          ))}
        </div>
      </div>
    </div> 
  );
};

export default Levels;
