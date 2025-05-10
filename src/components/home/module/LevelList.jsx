import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLevels,
  fetchModule,
  selectLevels,
  selectModuleLoading,
  selectModuleError,
  selectModuleId,
} from "../../../features/module/moduleSlice";
import {
  fetchUserProgress,
  fetchUserModuleProgress,
  selectProgress
} from "../../../features/userProgress/userProgressSlice";
import LoadingPage from "../../../pages/LoadingPage";

import ArrowRight from "../../../assets/icons/arrowRight";
import { motion } from "framer-motion";
import Html from "../../../assets/icons/html.svg";
import Python from "../../../assets/icons/python.svg";
import Js from "../../../assets/icons/js.svg";
import Css from "../../../assets/icons/css.svg";
import ArrowBack from "../../../assets/icons/arrowBack.svg";
import { useParams } from 'react-router-dom';

export const LevelList = () => {
  const { moduleSlug } = useParams(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const progress = useSelector(selectProgress);
  const levels = useSelector((state) => selectLevels(state, moduleSlug));
  const moduleLoading = useSelector(selectModuleLoading);
  const moduleError = useSelector(selectModuleError);
  const moduleId = useSelector((state) => selectModuleId(state, moduleSlug))

  const [currentProgress, setCurrentProgress] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const courseImage = {
    "python": {
      image: <img src={Python || "/placeholder.svg"} alt="Python logo" />,
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
    "javascript": {
      image: <img src={Js || "/placeholder.svg"} alt="JS logo" />,
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
    "html": {
      image: <img src={Html || "/placeholder.svg"} alt="Html logo" />,
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
    "css": {
      image: <img src={Css || "/placeholder.svg"} alt="CSS logo" />,
      course: "CSS",
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
    if (!moduleSlug) return;    
    const loadInitialData = async () => {
      try {
        await dispatch(fetchModule(moduleSlug)).unwrap();
        await dispatch(fetchLevels(moduleSlug)).unwrap();
        if (!progress) {
          await dispatch(fetchUserProgress()).unwrap();
        }
        if (progress && !progress[moduleSlug] && moduleId) {
          await dispatch(fetchUserModuleProgress({ moduleId, moduleSlug })).unwrap()
        }
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setIsInitialLoad(false);
      }
    };
    
    loadInitialData();
  }, [moduleSlug, dispatch, progress, moduleId]);

  // This effect updates the current progress when data changes
  useEffect(() => {
    if (!moduleSlug || !levels || !progress || !progress[moduleSlug]) return;
    
    try {
      const moduleProgress = progress[moduleSlug];
      const currentLevel = levels[moduleProgress.current_level_id];
      
      if (currentLevel) {
        const currentLevelIndex = currentLevel.order - 1;
        const levelProgress = 0;
        
        setCurrentProgress({
          currentLevelIndex,
          levelProgress
        });
      }
    } catch (error) {
      console.error("Error setting progress:", error);
    }
  }, [moduleSlug, levels, progress]);

  // Reset state when module changes
  useEffect(() => {
    setIsInitialLoad(true);
    setCurrentProgress(null);
  }, [moduleSlug]);

  const handleLevelClick = (levelId) => {
    navigate(`/learn/modules/${moduleSlug}/levels/${levelId}`);
  };

  // Show loading state during initial load
  if (isInitialLoad || moduleLoading) {
    return <LoadingPage message={"Cargando niveles..."} />;
  }

  // Show error state
  if (moduleError) {
    return <div className="text-center p-8">Error: {moduleError.message || "Ocurrió un error al cargar los datos"}</div>;
  }

  // Show loading state if we have levels but no progress yet
  // if (!currentProgress?) {
  //   return <LoadingPage message={"Cargando progreso..."} />;
  // }

  return (
    <div className="w-full max-w-5xl px-4 mx-auto">
      {moduleSlug && levels ? (
        <>
          <div className="flex max-w-md">
            <div
              style={{
                background: courseImage[moduleSlug].backgroundCurrent,
                border: `2px solid ${courseImage[moduleSlug].backgroundDone}`,
              }}
              className={`flex flex-col py-3 px-6 mt-4 rounded-xl border-2 border-[#F9BEA8] w-full`}
            >
              <button
                onClick={() => navigate(`/learn/modules`)}
                className="flex items-center"
              >
                <img src={ArrowBack || "/placeholder.svg"} alt="arrow back" />
                <span
                  className={`text-white text-lg font-sans ml-2 font-medium`}
                >
                  Volver
                </span>
              </button>
              <div className="flex mt-3">
                {courseImage[moduleSlug]?.image}
                <span className="ml-2 text-white font-sans text-xl font-medium">
                  {courseImage[moduleSlug]?.course}
                </span>
              </div>
            </div>
            {/* <StreaksNDiamonds /> */}
          </div>
          <div className="relative w-full mt-32">
            {Object.values(levels)?.map((level, index) => {
              const progressBarColor =
                index < currentProgress?.currentLevelIndex
                  ? courseImage[moduleSlug]?.barDone
                  : index === currentProgress?.currentLevelIndex
                  ? courseImage[moduleSlug]?.barCurrent
                  : "#DDDDDD";
              const remainingProgressBarColor =
                index < currentProgress?.currentLevelIndex
                  ? courseImage[moduleSlug]?.barDone
                  : index === currentProgress?.currentLevelIndex
                  ? courseImage[moduleSlug]?.barUnfilled
                  : "#DDDDDD";
              return (
                <motion.div
                  onClick={() => handleLevelClick(level.id)}
                  key={level.id}
                  className={`absolute w-full rounded-[50px] h-[400px] overflow-hidden flex items-start justify-start py-10 px-12 ${
                    index > currentProgress?.currentLevelIndex ? "pointer-events-none" : ""
                  }`}
                  style={{
                    top: `${index * 250}px`,
                    zIndex: index,
                    border: `2px solid ${
                      index < currentProgress?.currentLevelIndex
                        ? courseImage[moduleSlug].borderDone
                        : index === currentProgress?.currentLevelIndex
                        ? courseImage[moduleSlug].borderCurrent
                        : courseImage[moduleSlug].borderDisable
                    }`,
                    backgroundColor:
                      index < currentProgress?.currentLevelIndex
                        ? courseImage[moduleSlug].backgroundDone
                        : index === currentProgress?.currentLevelIndex
                        ? courseImage[moduleSlug].backgroundCurrent
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
                        index <= currentProgress?.currentLevelIndex
                          ? "text-white"
                          : "text-[#ADADAD]"
                      }`}
                    >
                      {`Nivel ${level.order}`}: {level.name}
                    </span>
                    <div className="mt-2">
                      <p
                        className={`font-mono text-2xl ${
                          index <= currentProgress?.currentLevelIndex
                            ? "text-white"
                            : "text-[#ADADAD]"
                        }`}
                      >
                        {level.description || ""}
                      </p>
                    </div>
                    <div className="flex flex-row-reverse items-center">
                      <span className="font-mono text-3xl text-white ml-12">
                        {index < currentProgress?.currentLevelIndex
                          ? "100%"
                          : index === currentProgress?.currentLevelIndex
                          ? currentProgress?.levelProgress.toFixed(2) + "%"
                          : "0%"}
                      </span>
                      <div
                        style={{
                          background:
                            index < currentProgress?.currentLevelIndex
                              ? courseImage[moduleSlug].barUnfilled
                              : index === currentProgress?.currentLevelIndex
                              ? courseImage[moduleSlug].barUnfilled
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
                      ${progressBarColor} ${
                              index < currentProgress?.currentLevelIndex
                                ? 100
                                : currentProgress?.levelProgress
                            }%, 
                      ${remainingProgressBarColor} ${
                              index < currentProgress?.currentLevelIndex
                                ? 100
                                : currentProgress?.levelProgress
                            }%
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
