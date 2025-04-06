import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLevels,
  fetchModules,
  selectLevels,
} from "../../../features/module/moduleSlice";
import LoadingPage from "../../../pages/LoadingPage";

import ArrowRight from "../../../assets/icons/arrowRight";
import { motion } from "framer-motion";
// import StreaksNDiamonds from "../../common/Streaks&Diamons/Streaks&Diamons";
import Html from "../../../assets/icons/html.svg";
import Python from "../../../assets/icons/python.svg";
import Js from "../../../assets/icons/js.svg";
import Css from "../../../assets/icons/css.svg";
import ArrowBack from "../../../assets/icons/arrowBack.svg";
import { useParams } from 'react-router-dom';
import { fetchUserProgress } from "../../../features/userProgress/userProgressSlice";

export const LevelList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const levels = useSelector((state) => selectLevels(state, moduleId));
  const { progress } = useSelector((state) => state.userProgress || {});
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(null);
  const modulesLoaded = useRef(false);
  const progressLoaded = useRef(false);
  const levelsLoaded = useRef(false);

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
      image: <img src={Js} alt="JS logo" />,
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
      course: "HTML V2",
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
      course: "HTML",
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!modulesLoaded.current) {
          await dispatch(fetchModules()).unwrap();
          modulesLoaded.current = true;
        }
  
        if (!progressLoaded.current) {
          await dispatch(fetchUserProgress()).unwrap();
          progressLoaded.current = true;
        }
  
        if (!levelsLoaded.current && moduleId) {
          await dispatch(fetchLevels(moduleId)).unwrap();
          levelsLoaded.current = true;
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [moduleId, dispatch]);
  
  useEffect(() => {
    if (loading || !progress || !levels || !moduleId || levels.length === 0) {
      return;
    }
    
    const moduleProgress = progress[moduleId];
    if (!moduleProgress) return;
    const currentLevel = levels[moduleProgress.currentLevel]

    setCurrentProgress({
      currentLevelIndex: currentLevel.order -1,
      levelProgress: moduleProgress.levelProgress,
    });
  }, [levels, moduleId, progress, loading]);

  useEffect(() => {
    modulesLoaded.current = false;
    progressLoaded.current = false;
    levelsLoaded.current = false;
    setLoading(true);
  }, [moduleId]);
  const handleLevelClick = (levelId) => {
    navigate(`/learn/modules/${moduleId}/levels/${levelId}`);
  };

  if (loading || !levels) return(<LoadingPage message={"Cargando niveles..."}/>)
  if (!currentProgress) return(<LoadingPage message={"Cargando progreso..."}/>)
  return (
    <div className="w-full max-w-5xl px-4 mx-auto">
      {moduleId && levels ? (
        <>
          <div className="flex max-w-md">
            <div
              style={{
                background: courseImage[moduleId].backgroundCurrent,
                border: `2px solid ${courseImage[moduleId].backgroundDone}`,
              }}
              className={`flex flex-col py-3 px-6  mt-4 rounded-xl border-2 border-[#F9BEA8] w-full`}
            >
                <button
                  onClick={() => navigate(`/learn/modules`)}
                  className="flex items-center"
                >
                  <img src={ArrowBack} alt="arrow back" />
                  <span
                    className={`text-white  text-lg font-sans ml-2 font-medium`}
                  >
                    Volver
                  </span>
                </button>
                <div className="flex mt-3">
                  {courseImage[moduleId]?.image}
                  <span className="ml-2 text-white font-sans text-xl font-medium">
                    {courseImage[moduleId]?.course}
                  </span>
                </div>
              </div>
            {/* <StreaksNDiamonds /> */}
          </div>
          <div className="relative w-full mt-32">
            {Object.values(levels)?.map((level, index) => {
              const progressBarColor =
                index < currentProgress.currentLevelIndex
                  ? courseImage[moduleId]?.barDone
                  : index === currentProgress.currentLevelIndex
                  ? courseImage[moduleId]?.barCurrent
                  : "#DDDDDD";
              const remainingProgressBarColor =
                index < currentProgress.currentLevelIndex
                  ? courseImage[moduleId]?.barDone
                  : index === currentProgress.currentLevelIndex
                  ? courseImage[moduleId]?.barUnfilled
                  : "#DDDDDD";
              return (
                <motion.div
                  onClick={() => handleLevelClick(level._id)}
                  key={level._id}
                  className={`absolute w-full rounded-[50px] h-[400px] overflow-hidden flex items-start justify-start py-10 px-12 ${
                    index > currentProgress.currentLevelIndex ? "pointer-events-none" : ""
                  }`}                  style={{
                    top: `${index * 250}px`,
                    zIndex: index,
                    border: `2px solid ${
                      index < currentProgress.currentLevelIndex
                        ? courseImage[moduleId].borderDone
                        : index === currentProgress.currentLevelIndex
                        ? courseImage[moduleId].borderCurrent
                        : courseImage[moduleId].borderDisable
                    }`,
                    backgroundColor:
                      index < currentProgress.currentLevelIndex
                        ? courseImage[moduleId].backgroundDone
                        : index === currentProgress.currentLevelIndex
                        ? courseImage[moduleId].backgroundCurrent
                        : "white",
                  }}
                  whileHover={{
                    y: -20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col justify-start">
                    <span
                      className={`font-mono text-5xl ${
                        index <= currentProgress.currentLevelIndex
                          ? "text-white"
                          : "text-[#ADADAD]"
                      }`}
                    >
                      {`Nivel ${level.order}`}: {level.name}
                    </span>
                    <div className="mt-2">
                      <p
                        className={`font-mono text-2xl ${
                          index <= currentProgress.currentLevelIndex
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
                        {index < currentProgress.currentLevelIndex
                          ? "100%"
                          : index === currentProgress.currentLevelIndex
                          ? currentProgress?.levelProgress.toFixed(2) + "%"
                          : "0%"}
                      </span>
                      <div
                        style={{
                          background:
                            index < currentProgress.currentLevelIndex
                              ? courseImage[moduleId].barUnfilled
                              : index === currentProgress.currentLevelIndex
                              ? courseImage[moduleId].barUnfilled
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
