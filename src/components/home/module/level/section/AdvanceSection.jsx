import React from "react";
import "../../styles/advanceSection.css";
import robotImage from "../../../../assets/robot.png";
import { useDispatch } from "react-redux";
import { advanceCourse } from "../../features/userProgress/userProgressSlice";

const AdvanceSection = ({ advance }) => {
  const dispatch = useDispatch();

  const handleAdvanceSection = async () => {
    await dispatch(advanceCourse());
    advance();
  };

  return (
    <div className="flex flex-col mx-auto justify-center">
      <h2 className="message">¡Felicidades! Has completado la sección.</h2>

      <button className="next-button" onClick={handleAdvanceSection}>
        Avanzar a la siguiente sección
      </button>

      <div className="robot-container-section">
        <img src={robotImage} alt="Robot" className="robot-image-section" />
      </div>
    </div>
  );
};

export default AdvanceSection;
