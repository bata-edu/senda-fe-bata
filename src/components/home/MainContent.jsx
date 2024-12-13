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
import Modules from "./CourseSelector";
import robot from "../../assets/robot.png";
import { setSelectedModule } from "../../features/module/moduleSlice";
import ArrowRight from "../../assets/icons/arrowRight";
import { motion } from "framer-motion";
import StreaksNDiamonds from "../common/Streaks&Diamons/Streaks&Diamons";
import Html from "../../assets/icons/html.svg";
import Python from "../../assets/icons/python.svg";

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
  const colors = ["blue", "red", "green", "purple", "orange", "teal", "pink"];

  const courseImage = {
    Python: { image: <img src={Python} alt="Html logo" />, course: "Python" },
    JavaScript: { image: <img src={Html} alt="Html logo" />, course: "Python" },
    CSS: { image: <img src={Html} alt="Html logo" />, course: "Python" },
    "66fc2fb14c227e973f81b4d1": {
      image: <img src={Html} alt="Html logo" />,
      course: "Html",
      backgroundCurrent: "#EE5E37",
      backgroundDone: "#F59D7C",
      borderCurrent: "#EB4624",
      borderDone: "#B72017",
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
      dispatch(fetchLevelInfo({ courseId: moduleId, page, limit: 3 })),
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
    console.log(levelId);
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
            <div className="flex flex-col py-4 px-6 bg-[#EE5E37] mt-4 rounded-xl border-2 border-[#F9BEA8] w-full">
              <div onClick={() => navigate(`/learn/modules`)}>
                <span className="text-white font-sans">Ir a Lenguajes</span>
                <div className="flex">
                  {courseImage[selectedModule].image}
                  <span className="ml-2 text-white font-mono">
                    {courseImage[selectedModule].course}
                  </span>
                </div>
              </div>
            </div>
            <StreaksNDiamonds />
          </div>
          <div className="relative h-screen w-full mt-36">
            {levelsInfo?.map((level, index) => {
              console.log(index, userCurrentInfo.currentLevelIndex);
              return (
                <motion.div
                  onClick={() => handleSectionClick(level._id)}
                  key={level.id}
                  className={`absolute w-full rounded-[50px] h-[400px] flex flex-col items-center justify-start py-10 px-12 border-2`}
                  style={{
                    top: `${index * 250}px`,
                    zIndex: index,
                    borderColor:
                      index < userCurrentInfo.currentLevelIndex
                        ? courseImage[selectedModule].borderDone
                        : index == userCurrentInfo.currentLevelIndex
                        ? courseImage[selectedModule].borderCurrent
                        : courseImage[selectedModule].borderDisable,
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
                  <div className="flex justify-between w-full">
                    <span
                      // onClick={() => updateSelectedModule(module.id)}
                      className={`font-mono text-5xl ${
                        index <= userCurrentInfo.currentLevelIndex
                          ? "text-white"
                          : "text-[#ADADAD]"
                      }`}
                    >
                      {`NIVEL ${level.order}`}
                    </span>
                    <span className="font-mono text-3xl text-white">
                      {module.percentage || 0}%
                    </span>
                  </div>
                  <div className="flex flex-col justify-between w-full mt-4">
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
                    <div className="flex">
                      <div
                        style={{
                          background:
                            index < userCurrentInfo.currentLevelIndex
                              ? courseImage[selectedModule].barUnfilled
                              : index == userCurrentInfo.currentLevelIndex
                              ? courseImage[selectedModule].barUnfilled
                              : "#DDDDDD",
                        }}
                        className="w-full rounded-full h-2.5 "
                      >
                        <div
                          style={{
                            background:
                              index < userCurrentInfo.currentLevelIndex
                                ? courseImage[selectedModule].barDone
                                : index == userCurrentInfo.currentLevelIndex
                                ? courseImage[selectedModule].barCurrent
                                : "#DDDDDD",
                          }}
                          className={` h-2.5 rounded-full w-[45%]`}
                        ></div>
                      </div>

                      <ArrowRight color={"white"} />
                    </div>
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
