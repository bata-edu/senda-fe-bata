import React, { useEffect } from "react";
import robotImage from "../../assets/robot.png";
import booksImage from "../../assets/laptop.png";
import "../../styles/class.css";
import { useNavigate } from "react-router-dom";
import {
  fetchNextClass,
  completeClass,
  fetchNextAction,
} from "../../features/userProgress/userProgressSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "../../pages/LoadingPage";

const SectionClass = ({ advance }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myClass, progress, nextAction } = useSelector(
    (state) => state.userProgress || {}
  );

  useEffect(() => {
    dispatch(fetchNextClass(progress.course));
  }, [dispatch, nextAction]);

  const advanceClass = async () => {
    await dispatch(completeClass(myClass.id));
    advance();
  };
  return (
    <div className="clase-container">
      {!myClass?.id && (
        <div className="loading">
          <LoadingPage />
        </div>
      )}
      <div className="header">
        <button className="close-button" onClick={() => navigate("/home")}>
          X
        </button>
        <div className="header-buttons">
          <button className="skip-button">SALTAR</button>
          <button className="advance-button" onClick={() => advanceClass()}>
            AVANZAR
          </button>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress"></div>
      </div>
      <div className="content">
        <div className="text-container">
          <h2>{myClass?.name}</h2>
          <p>{myClass?.description}</p>
        </div>
        <div className="images-container">
          <div className="message-container">
            <div className="speech-bubble">
              <p>{myClass?.content}</p>
            </div>
            <div className="robot-image-class">
              <img src={robotImage} alt="Robot" />
            </div>
          </div>
          <div className="books-image">
            <img src={booksImage} alt="Books" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionClass;
