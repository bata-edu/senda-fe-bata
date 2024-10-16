import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLevelInfo,
  fetchAllLevels,
} from "../../features/level/levelSlice";
import {
  fetchUserProgress,
  startCourse,
} from "../../features/userProgress/userProgressSlice";
import robot from "../../assets/robot.png";
import "../../styles/mainContent.css";
import LoadingPage from "../../pages/LoadingPage";

const MainContent = () => {
  const dispatch = useDispatch();
  const {
    levelsInfo = [],
    page,
    loading: loadingLevel,
  } = useSelector((state) => state.level || {});
  const {
    progress,
    courseId,
    loading: loadingProgress,
  } = useSelector((state) => state.userProgress || {});
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hasMoreLevels, setHasMoreLevels] = useState(true);
  const [showNoMoreLevels, setShowNoMoreLevels] = useState(false);
  const sentinelRef = useRef(null);
  const levelRefs = useRef({});
  const [loading, setLoading] = useState(false);

  const [userCurrentInfo, setUserCurrentInfo] = useState({
    currentLevelIndex: 0,
    currentSectionIndex: 0,
  });

  const setLevelInfo = async () => {
    if (courseId) {
      const currentLevel = levelsInfo.find(
        (level) => level._id === progress[0].currentLevel
      );
      const currentLevelIndex = levelsInfo.findIndex(
        (level) => level._id === progress[0].currentLevel
      );
      const currentSectionIndex =
        currentLevel?.sections.findIndex(
          (section) => section._id === progress[0].currentSection
        ) || 0;
      setUserCurrentInfo({ currentLevelIndex, currentSectionIndex });
    }
  };

  useEffect(() => {
    setLevelInfo();
  }, []);

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
        if (entry.isIntersecting && hasMoreLevels && !loadingLevel) {
          try {
            if (window.location.hash) {
              window.history.replaceState(null, null, window.location.pathname);
            }

            const response = await dispatch(
              fetchLevelInfo({ courseId, page, limit: 3 })
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
        while (!targetLevel && hasMoreLevels && !loadingLevel) {
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

  const handleStartCourse = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        startCourse(process.env.REACT_APP_COURSE_ID)
      ).unwrap();
      await Promise.all([
        dispatch(fetchUserProgress()),
        dispatch(fetchLevelInfo({ courseId: response.course, page, limit: 3 })),
        dispatch(fetchAllLevels({ courseId: response.course })),
      ]);
      setLevelInfo();
      setLoading(false);
    } catch (error) {
      console.log("Error starting course:", error);
    }
  };
  return (
    <div className="main-content">
      {loading && (
        <div className="loading">
          <LoadingPage />
        </div>
      )}
      {levelsInfo?.length ? (
        <div className="progress-path">
          <div className="level-container">
            {levelsInfo.map((level, levelIndex) => (
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
                    {level.sections.map((section, sectionIndex) => (
                      <div
                        key={section._id}
                        className={`section-icon ${
                          levelIndex < userCurrentInfo.currentLevelIndex ||
                          (levelIndex === userCurrentInfo.currentLevelIndex &&
                            sectionIndex <= userCurrentInfo.currentSectionIndex)
                            ? "active"
                            : "disabled"
                        }`}
                        style={getMarginStyle(sectionIndex)}
                        onMouseEnter={() => setHoveredSection(section.name)}
                        onMouseLeave={() => setHoveredSection(null)}
                      >
                        <img
                          src={getImageSrc(sectionIndex)}
                          alt={`Section ${sectionIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="robot">
                    <img src={robot} alt="Robot" />
                  </div>
                </div>
                <div className="robot-final-container">
                  <div className="robot-final">
                    <img src={robot} alt="Robot" />
                  </div>
                </div>
                <div className="final-project-container">
                  <div className="final-project-title">
                    <h3>{level.finalLevelProject[0]?.title}</h3>
                  </div>
                </div>
              </div>
            ))}
            <div ref={sentinelRef} className="sentinel"></div>
          </div>
        </div>
      ) : (
        <div className="no-progress">
          <h2>No has comenzado ningun curso</h2>
          <button className="btn-start-course" onClick={handleStartCourse}>
            Empezar curso
          </button>
        </div>
      )}
      {showNoMoreLevels && (
        <div className="no-more-levels">No hay más niveles disponibles.</div>
      )}
      {hoveredSection && (
        <div className="section-tooltip">{hoveredSection}</div>
      )}
    </div>
  );
};

export default MainContent;
