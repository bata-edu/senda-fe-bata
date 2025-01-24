import React, { useEffect, useState } from "react";
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

const SectionClass = ({ advance, completedClass, loadingNextAction }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { myClass, currentProgress, nextAction } = useSelector(
    (state) => state.userProgress || {}
  );

  useEffect(() => {
    if (!completedClass || !loadingNextAction) {
      dispatch(fetchNextClass(currentProgress.course));
    }
  }, [dispatch, completedClass, nextAction]);

  const advanceClass = async () => {
    setLoading(true);
    if (!completedClass) {
      await dispatch(completeClass(myClass.id));
    }
    advance();
  };

  const currentLesson = completedClass || myClass;

  useEffect(() => {
    if (currentLesson) {
      setLoading(false);
    }
  }, [currentLesson]);

  return (
    <div className="flex h-[70vh] justify-center items-center">
      {loading ? (
        <div>
          <LoadingPage />
        </div>
      ) : (
        <div className="border-2 border-[#E4E7EC] rounded-xl p-6 w-96">
          <div>
            <h2 className="text-lg">{currentLesson?.name}</h2>
            {/* <p>{currentLesson?.description}</p> */}
            <p>{currentLesson?.content}</p>
            <button
              onClick={() => advanceClass()}
              className="bg-[#4558C8] text-white py-2 w-full rounded-xl"
            >
              Siguiente
            </button>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default SectionClass;
