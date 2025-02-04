import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLevelInfo,
  fetchAllLevels,
} from "../../features/level/levelSlice";
import {
  fetchUserProgressById,
  startCourse,
} from "../../features/userProgress/userProgressSlice";
import LoadingPage from "../../pages/LoadingPage";

import ArrowRight from "../../assets/icons/arrowRight";
import { motion } from "framer-motion";
import StreaksNDiamonds from "../common/Streaks&Diamons/Streaks&Diamons";
import Html from "../../assets/icons/html.svg";
import Python from "../../assets/icons/python.svg";
import Js from "../../assets/icons/js.svg";
import Css from "../../assets/icons/css.svg";
import ArrowBack from "../../assets/icons/arrowBack.svg";

const MainContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { levelsInfo = [], page } = useSelector((state) => state.level || {});
  const { currentProgress, courseId } = useSelector(
    (state) => state.userProgress || {}
  );
  const [loading, setLoading] = useState(true);

  const [userCurrentInfo, setUserCurrentInfo] = useState({
    currentLevelIndex: 0,
    currentSectionIndex: 0,
    lastSectionIndex: 0,
  });

  const selectedModule = localStorage.getItem("selectedModule");

  const courseImage = {
    "671909eecc62ee9e8f06c578": {
      image: <img src={Python} alt="Html logo" />,
      course: "Python",
      backgroundCurrent: "#4A3167",
      backgroundDone: "#9B4CD1",
      borderCurrent: "#C694EC",
      borderDone: "#DDC4F0",
      borderDisable: "#C8C8C8",
      barDone: "#6F3396",
      barCurrent: "#6F3396",
      barUnfilled: "#E1B9FF",
    },
    "67190a2ecc62ee9e8f06c57b": {
      image: <img src={Js} alt="Html logo" />,
      course: "JavaScript",
      backgroundCurrent: "#C6E635",
      backgroundDone: "#EBF99D",
      borderCurrent: "#83A30D",
      borderDone: "#83A30D",
      borderDisable: "#C8C8C8",
      barDone: "#EB4624",
      barCurrent: "#627C0F",
      barUnfilled: "#EBF99D",
    },
    "676ee8640324ad0b3cda0bc6": {
      image: <img src={Html} alt="Html logo" />,
      course: "Html",
      backgroundCurrent: "#EE5E37",
      backgroundDone: "#F59D7C",
      borderCurrent: "#B72017",
      borderDone: "#EB4624",
      borderDisable: "#C8C8C8",
      barDone: "#EB4624",
      barCurrent: "#B72017",
      barUnfilled: "#F59D7C",
    },
    "66fc2fb14c227e973f81b4d1": {
      image: <img src={Html} alt="Html logo" />,
      course: "Html",
      backgroundCurrent: "#EE5E37",
      backgroundDone: "#F59D7C",
      borderCurrent: "#B72017",
      borderDone: "#EB4624",
      borderDisable: "#C8C8C8",
      barDone: "#EB4624",
      barCurrent: "#B72017",
      barUnfilled: "#F59D7C",
    },
    "6749b2b80a8216bdad69e17b": {
      image: <img src={Css} alt="Html logo" />,
      course: "Css",
      backgroundCurrent: "#3D48B8",
      backgroundDone: "#3D48B8",
      borderCurrent: "#7B97DF",
      borderDone: "#7B97DF",
      borderDisable: "#C8C8C8",
      barDone: "#313777",
      barCurrent: "#313777",
      barUnfilled: "#5B75D6",
    },
  };

  const setLevelInfo = async () => {
    if (courseId) {
      const currentLevel = levelsInfo?.find(
        (level) => level._id === currentProgress.currentLevel
      );
      const currentLevelIndex = levelsInfo?.findIndex(
        (level) => level._id === currentProgress.currentLevel
      );
      const currentSectionIndex =
        currentLevel?.sections.findIndex(
          (section) => section._id === currentProgress.currentSection
        ) || 0;

      setUserCurrentInfo({ currentLevelIndex, currentSectionIndex });
    }
  };

  useEffect(() => {
    if (selectedModule) {
      fetchData(selectedModule);
    }
  }, []);

  useEffect(() => {
    if (levelsInfo && levelsInfo?.length) {
      setLevelInfo();
      setLoading(false);
    }
  }, [levelsInfo]);

  const fetchData = async (moduleId) => {
    await dispatch(fetchUserProgressById(moduleId))
    await Promise.all([
      dispatch(fetchLevelInfo({ courseId: moduleId, page: 0, limit: 100 })),
      dispatch(fetchAllLevels({ courseId: moduleId })),
    ]);
  };

  const handleSectionClick = (levelId) => {
    localStorage.setItem("selectedLevel", levelId);
    navigate(`/learn/sections`);
  };

  const handleFinalProjectClick = (levelIndex, levelId) => {
    let current = levelIndex === userCurrentInfo.currentLevelIndex;
    if (!current && currentProgress.courseCompleted) current = false;
    if (current) {
      navigate(`/progress?current=true`);
    } else {
      navigate(`/progress?level=${levelId}&index=${levelIndex}&current=false`);
    }
  };

  return (
    <div className="w-2/3 mx-auto">
      {loading && (
        <div className="w-full h-[90vh] flex justify-center items-center">
          <LoadingPage />
        </div>
      )}
      {selectedModule && levelsInfo?.length ? (
        <>
          <div className="flex w-full">
            <div
              style={{
                background: courseImage[selectedModule].backgroundDone,
                border: `2px solid ${courseImage[selectedModule].borderDone}`,
              }}
              className={`flex flex-col py-3 px-6  mt-4 rounded-xl border-2 border-[#F9BEA8] w-full`}
            >
              <div>
                <button
                  onClick={() => navigate(`/learn/modules`)}
                  className="flex items-center"
                >
                  <img src={ArrowBack} alt="arrow back" />
                  <span
                    className={`text-white  text-lg font-sans ml-2 font-medium`}
                  >
                    Ir a Lenguajes
                  </span>
                </button>
                <div className="flex mt-3">
                  {courseImage[selectedModule]?.image}
                  <span className="ml-2 text-white font-sans text-xl font-medium">
                    {courseImage[selectedModule]?.course}
                  </span>
                </div>
              </div>
            </div>
            <StreaksNDiamonds />
          </div>
          <div className="relative w-full mt-36">
            {levelsInfo?.map((level, index) => {
              const progressBarColor =
                index < userCurrentInfo.currentLevelIndex
                  ? courseImage[selectedModule]?.barDone
                  : index === userCurrentInfo.currentLevelIndex
                  ? courseImage[selectedModule]?.barCurrent
                  : "#DDDDDD";
              const remainingProgressBarColor =
                index < userCurrentInfo.currentLevelIndex
                  ? courseImage[selectedModule]?.barDone
                  : index === userCurrentInfo.currentLevelIndex
                  ? courseImage[selectedModule]?.barUnfilled
                  : "#DDDDDD";
              return (
                <motion.div
                  onClick={() => handleSectionClick(level._id)}
                  key={level.id}
                  className={`absolute w-full rounded-[50px] h-[400px] flex items-start justify-start py-10 px-12 ${
                    index > userCurrentInfo.currentLevelIndex ? "pointer-events-none" : ""
                  }`}                  style={{
                    top: `${index * 250}px`,
                    zIndex: index,
                    border: `2px solid ${
                      index < userCurrentInfo.currentLevelIndex
                        ? courseImage[selectedModule].borderDone
                        : index == userCurrentInfo.currentLevelIndex
                        ? courseImage[selectedModule].borderCurrent
                        : courseImage[selectedModule].borderDisable
                    }`,
                    backgroundColor:
                      index < userCurrentInfo.currentLevelIndex
                        ? courseImage[selectedModule].backgroundDone
                        : index == userCurrentInfo.currentLevelIndex
                        ? courseImage[selectedModule].backgroundCurrent
                        : "white",
                  }}
                  whileHover={{
                    y: -20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col justify-start w-2/3">
                    <span
                      className={`font-mono text-5xl ${
                        index <= userCurrentInfo.currentLevelIndex
                          ? "text-white"
                          : "text-[#ADADAD]"
                      }`}
                    >
                      {`Nivel ${level.order}`}
                    </span>
                    <div className="mt-2">
                      <p
                        className={`font-mono text-2xl ${
                          index <= userCurrentInfo.currentLevelIndex
                            ? "text-white"
                            : "text-[#ADADAD]"
                        }`}
                      >
                        Lorem Ipsumes simplemente el texto de relleno de las
                        imprentas.
                      </p>
                    </div>
                    <div className="flex flex-row-reverse items-center">
                      <span className="font-mono text-3xl text-white ml-12">
                        {index < userCurrentInfo.currentLevelIndex
                          ? "100%"
                          : index == userCurrentInfo.currentLevelIndex
                          ? currentProgress?.levelProgress + "%"
                          : "0%"}
                      </span>
                      <div
                        style={{
                          background:
                            index < userCurrentInfo.currentLevelIndex
                              ? courseImage[selectedModule].barUnfilled
                              : index === userCurrentInfo.currentLevelIndex
                              ? courseImage[selectedModule].barUnfilled
                              : "#DDDDDD",
                        }}
                        className="w-full rounded-md h-4 "
                      >
                        <motion.div
                          initial={{
                            background: `linear-gradient(
                      to right,
                      ${progressBarColor} 0%, 
                      ${remainingProgressBarColor} 0%
                    )`,
                          }}
                          animate={{
                            background: `linear-gradient(
                      to right,
                      ${progressBarColor} ${currentProgress?.levelProgress}%, 
                      ${remainingProgressBarColor} ${currentProgress?.levelProgress}%
                    )`,
                          }}
                          transition={{ duration: 1 }}
                          className={`h-4 rounded-md`}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end w-1/3 items-center ">
                    <ArrowRight color={"white"} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MainContent;
