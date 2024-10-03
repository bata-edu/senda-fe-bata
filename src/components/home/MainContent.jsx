import React from 'react';
import robot from '../../assets/robot.png'

const MainContent = () => {
  const totalStars = 5; 

  const generateStars = () => {
    const starsArray = [];
    for (let i = 1; i <= totalStars; i++) {
      starsArray.push(
        <div 
          key={i} 
          className="star"
          style={{ 
            transform: `rotate(${(i - totalStars / 2) * 0.5}deg) translateY(${(i - totalStars / 2) * 10}px)`
          }}
        >
          ⭐
        </div>
      );
    }
    return starsArray;
  };

  return (
    <div className="main-content">
      <div className="section-header">
        <h2>NIVEL 1, SECCIÓN 1</h2>
        <p>ETIQUETAS</p>
      </div>
      <div className="progress-path">
        <div className="stars-container">
          {generateStars()} {/* Generamos las estrellas dinámicamente */}
        </div>
        <div className="robot">
          <img src={robot} alt="Robot" />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
