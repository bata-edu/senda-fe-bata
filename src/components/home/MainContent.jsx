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
import ArrowBack from "../../assets/icons/arrowBack.svg";

const MainContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { levelsInfo = [], page } = useSelector((state) => state.level || {});
  const { currentProgress, courseId } = useSelector(
    (state) => state.userProgress || {}
  );
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoveredFinalProject, setHoveredFinalProject] = useState(false);

  const [hasMoreLevels, setHasMoreLevels] = useState(true);
  const [showNoMoreLevels, setShowNoMoreLevels] = useState(false);
  const sentinelRef = useRef(null);
  const levelRefs = useRef({});
  const [loading, setLoading] = useState(false);

  const [userCurrentInfo, setUserCurrentInfo] = useState({
    currentLevelIndex: 0,
    currentSectionIndex: 0,
    lastSectionIndex: 0,
  });

  const selectedModule = localStorage.getItem("selectedModule");

  const courseImage = {
    Python: { image: <img src={Python} alt="Html logo" />, course: "Python" },
    JavaScript: { image: <img src={Html} alt="Html logo" />, course: "Python" },
    CSS: { image: <img src={Html} alt="Html logo" />, course: "Python" },
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
    if (levelsInfo && levelsInfo.length) {
      setLevelInfo();
    }
  }, [levelsInfo]);

  const getImageSrc = (index) => {
    const sectionNumber = (index % 6) + 1;
    return require(`../../assets/sections-icons-enabled/seccion ${sectionNumber}.png`);
  };

  const getMarginStyle = (index) => {
    return (index + 1) % 2 === 0
      ? { marginRight: "120px" }
      : { marginLeft: "120px" };
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMoreLevels) {
          try {
            if (window.location.hash) {
              window.history.replaceState(null, null, window.location.pathname);
            }

            const response = await dispatch(
              fetchLevelInfo({ courseId: selectedModule, page, limit: 3 })
            ).unwrap();
            if (response.levels.length === 0) {
              setHasMoreLevels(false);
              setShowNoMoreLevels(true);
            }
          } catch (error) {
            console.error("Error loading more levels:", error);
          } finally {
          }
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.5,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [page, hasMoreLevels]);

  useEffect(() => {
    const handleHashChange = async () => {
      const levelId = window.location.hash.replace("#", "");
      if (levelId) {
        let targetLevel = levelsInfo.find((level) => level._id === levelId);
        let levelPage = 0;
        while (!targetLevel && hasMoreLevels) {
          try {
            const response = await dispatch(
              fetchLevelInfo({ courseId, page: levelPage, limit: 3 })
            ).unwrap();
            if (response.levels.length === 0) {
              setHasMoreLevels(false);
              break;
            }
            targetLevel = response.levels.find(
              (level) => level._id === levelId
            );
            levelPage++;
          } catch (error) {
            console.error("Error fetching levels:", error);
            setHasMoreLevels(false);
            break;
          }
        }

        if (targetLevel) {
          const targetElement = levelRefs.current[levelId];
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (showNoMoreLevels) {
      const timer = setTimeout(() => {
        setShowNoMoreLevels(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNoMoreLevels]);

  const fetchData = async (moduleId) => {
    await Promise.all([
      dispatch(fetchUserProgressById(moduleId)),
      dispatch(fetchLevelInfo({ courseId: moduleId, page: 0, limit: 100 })),
      dispatch(fetchAllLevels({ courseId: moduleId })),
    ]);
  };

  const handleStartCourse = async (moduleId) => {
    try {
      setLoading(true);
      const response = await dispatch(startCourse(moduleId)).unwrap();
      await fetchData(moduleId);
      setLevelInfo();
      setLoading(false);
    } catch (error) {
      console.error("Error starting course:", error);
    }
  };

  const isSectionEnabled = (levelIndex, sectionIndex) => {
    if (levelIndex < userCurrentInfo.currentLevelIndex) {
      return true;
    } else if (
      levelIndex === userCurrentInfo.currentLevelIndex &&
      sectionIndex <= userCurrentInfo.currentSectionIndex
    ) {
      return true;
    }
    return false;
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
        <div className="loading">
          <LoadingPage />
        </div>
      )}
      {selectedModule && levelsInfo?.length ? (
        <>
          {/* {levelsInfo.map((level, levelIndex) => (
              <div
                key={level._id}
                className={`level-info
                ${
                  levelIndex <= userCurrentInfo.currentLevelIndex
                    ? "active"
                    : "disabled"
                }`}
                ref={(el) => (levelRefs.current[level._id] = el)}
              >
                <div className="level-header">
                  <h2>{`NIVEL ${level.order}`}</h2>
                </div>
                <div className="section-content">
                  <div className="snake-path">
                    {level.sections.map((section, sectionIndex) => {
                      const enabled = isSectionEnabled(
                        levelIndex,
                        sectionIndex
                      );
                      return (
                        <div
                          key={section._id}
                          className={`section-icon ${
                            enabled ? "active" : "disabled"
                          }`}
                          style={getMarginStyle(sectionIndex)}
                          onMouseEnter={() => setHoveredSection(section.name)}
                          onMouseLeave={() => setHoveredSection(null)}
                          onClick={() =>
                            enabled &&
                            handleSectionClick(
                              section._id,
                              levelIndex,
                              sectionIndex
                            )
                          }
                        >
                          <img
                            src={getImageSrc(sectionIndex)}
                            alt={`Section ${sectionIndex + 1}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="robot">
                    <img src={robot} alt="Robot" />
                  </div>
                </div>
                <div
                  className={`robot-final-container ${
                    levelIndex <= userCurrentInfo.currentLevelIndex
                      ? "active"
                      : "disabled"
                  }`}
                  onMouseEnter={() => setHoveredFinalProject(level._id)}
                  onMouseLeave={() => setHoveredFinalProject(null)}
                  onClick={() =>
                    levelIndex <= userCurrentInfo.currentLevelIndex &&
                    handleFinalProjectClick(levelIndex, level._id)
                  }
                >
                  <div className="robot-final">
                    <img src={robot} alt="Robot" />
                  </div>
                  {hoveredFinalProject === level._id &&
                    level.finalLevelProject[0]?.title && (
                      <div className="final-project-title">
                        <h3>{level.finalLevelProject[0].title}</h3>
                      </div>
                    )}
                </div>
              </div>
            ))} */}
          <div className="flex w-full">
            <div className="flex flex-col py-3 px-6 bg-[#EE5E37] mt-4 rounded-xl border-2 border-[#F9BEA8] w-full">
              <div>
                <button
                  onClick={() => navigate(`/learn/modules`)}
                  className="flex items-center"
                >
                  <img src={ArrowBack} alt="arrow back" />
                  <span className="text-white text-lg font-sans ml-2 font-medium">
                    Ir a Lenguajes
                  </span>
                </button>
                <div className="flex mt-3">
                  {courseImage[selectedModule].image}
                  <span className="ml-2 text-white font-sans text-xl font-medium">
                    {courseImage[selectedModule].course}
                  </span>
                </div>
              </div>
            </div>
            <StreaksNDiamonds />
          </div>
          <div className="relative h-screen w-full mt-36">
            {levelsInfo?.map((level, index) => {
              const progressBarColor =
                index < userCurrentInfo.currentLevelIndex
                  ? courseImage[selectedModule].barDone
                  : index === userCurrentInfo.currentLevelIndex
                  ? courseImage[selectedModule].barCurrent
                  : "#DDDDDD";
              const remainingProgressBarColor =
                index < userCurrentInfo.currentLevelIndex
                  ? courseImage[selectedModule].barDone
                  : index === userCurrentInfo.currentLevelIndex
                  ? courseImage[selectedModule].barUnfilled
                  : "#DDDDDD";
              return (
                <motion.div
                  onClick={() => handleSectionClick(level._id)}
                  key={level.id}
                  className={`absolute w-full rounded-[50px] h-[400px] flex  items-startf justify-start py-10 px-12 `}
                  style={{
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
      {selectedModule && showNoMoreLevels && (
        <div className="no-more-levels">No hay más niveles disponibles.</div>
      )}
      {selectedModule && hoveredSection && (
        <div className="section-tooltip">{hoveredSection}</div>
      )}
    </div>
  );
};

export default MainContent;
