import React from 'react';
import robotImage from '../../assets/robot.png';
import booksImage from '../../assets/laptop.png';
import '../../styles/class.css';
import { useNavigate } from 'react-router-dom';


const SectionClass = ({ title, subtitle, message }) => {
    const navigate = useNavigate();

  return (
    <div className="clase-container">
      <div className="header">
        <button className="close-button" onClick={() => navigate('/home')}>X</button>
        <div className='header-buttons'>
            <button className="skip-button">SALTAR</button>
            <button className='advance-button'>AVANZAR</button>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress"></div>
      </div>
      <div className="content">
        <div className="text-container">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="images-container">
          <div className="message-container">
            <div className="speech-bubble">
              <p>{message}</p>
            </div>
            <div className="robot-image">
                <img src={robotImage} alt="Robot"/>
            </div>
          </div>
          <div className="books-image" >
            <img src={booksImage} alt="Books" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionClass;
