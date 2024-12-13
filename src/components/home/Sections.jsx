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

const Sections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { levelsInfo = [], page } = useSelector((state) => state.level || {});
  const { currentProgress, courseId } = useSelector(
    (state) => state.userProgress || {}
  );

  const [hasMoreLevels, setHasMoreLevels] = useState(true);
  const [showNoMoreLevels, setShowNoMoreLevels] = useState(false);
  const sentinelRef = useRef(null);
  const levelRefs = useRef({});
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(false);

  const [userCurrentInfo, setUserCurrentInfo] = useState({
    currentLevelIndex: 0,
    currentSectionIndex: 0,
    lastSectionIndex: 0,
  });

  const courseImage = {
    Python: { course: "Python" },
    JavaScript: { course: "Python" },
    CSS: { course: "Python" },
    "66fc2fb14c227e973f81b4d1": {
      course: "Html",
      border: "#F59D7C",
      progress: "#DD2E19B2",
      background: "#FEF5F2",
    },
  };

  const selectedModule = localStorage.getItem("selectedModule");

  useEffect(() => {
    const selectedLevelId = localStorage.getItem("selectedLevel");
    const selectedLevel = levelsInfo?.find(
      (level) => level?._id === selectedLevelId
    );
    setLevel(selectedLevel);
  }, [levelsInfo]);

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
    localStorage.setItem("selectedLevel", levelId);
    navigate(`/sections`);
  };

  return (
    <div>
      <div className="flex flex-col py-4 px-6 bg-[#EE5E37] mt-4 rounded-xl border-2 border-[#F9BEA8]">
        <div onClick={() => navigate(`/learn/levels`)}>Volver a Niveles</div>
      </div>
      <div className="relative w-full h-auto flex justify-center items-start mt-12">
        {["", "", "", "", ""].map((section, index) => {
          // Calcula la posición relativa dentro del bloque (0 a 4)
          const position = index % 5;

          // Calcula el desplazamiento vertical para el bloque actual
          const rowOffset = Math.floor(index / 5) * 300; // Ajusta la separación vertical entre bloques

          // Define las posiciones y estilos para cada posición en el patrón
          const positions = [
            {
              className:
                "absolute left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center",
              top: "0px",
              extra: (
                <div
                  className="w-1 h-20 relative ml-[70px]"
                  style={{
                    borderLeft: "3px dashed gray", // Borde izquierdo
                    borderBottom: "3px dashed gray", // Borde inferior
                    borderTop: "none",
                    borderRight: "none",
                    width: "75px", // Ajusta el ancho para la base de la "L"
                    height: "75px", // Ajusta la altura para la parte vertical de la "L"
                  }}
                ></div>
              ),
            },
            {
              className: "absolute left-[55%] flex flex-col items-center",
              top: "110px",
              extra: (
                <div
                  style={{
                    position: "absolute",
                    top: "50%", // Centrado verticalmente dentro del contenedor
                    left: "100%", // Justo a la derecha del contenido
                    width: "60px", // Longitud de la línea horizontal
                    height: "0px", // Altura 0 ya que es solo una línea
                    borderBottom: "3px dashed gray", // Línea discontinua usando border
                  }}
                ></div>
              ),
            },
            {
              className:
                "absolute mt-16 left-[60.2%] flex flex-col items-center",
              top: "90px",
              extra: (
                <>
                  <div
                    style={{
                      marginBottom: "-20px",
                      borderRight: "3px dashed gray",
                      marginRight: "70px",
                      width: "75px",
                      height: "75px",
                    }}
                  ></div>
                </>
              ),
            },

            {
              className:
                "absolute left-[55%] flex flex-col items-center z-[10]",
              top: "320px",
              extra: (
                <div
                  className="w-1 h-20 absolute ml-32 -mt-8"
                  style={{
                    borderRight: "3px dashed gray", // Borde izquierdo
                    borderBottom: "3px dashed gray", // Borde inferior
                    borderTop: "none",
                    width: "75px", // Ajusta el ancho para la base de la "L"
                    height: "75px", // Ajusta la altura para la parte vertical de la "L"
                  }}
                ></div>
              ),
            },
            {
              className:
                "absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center",
              top: "430px",
              extra: (
                <div
                  className="w-1 h-20 absolute ml-[75px] -mt-[70px]"
                  style={{
                    borderLeft: "3px dashed gray", // Borde izquierdo
                    borderTop: "3px dashed gray", // Borde inferior
                    width: "75px", // Ajusta el ancho para la base de la "L"
                    height: "75px", // Ajusta la altura para la parte vertical de la "L"
                  }}
                ></div>
              ),
            },
          ];

          const { className, top, extra } = positions[position];

          return (
            <div
              key={index}
              className={`${className}`}
              style={{ top: `calc(${top} + ${rowOffset}px)` }}
            >
              {extra}
              <div
                style={{
                  background: courseImage[level?.parent]?.background,
                  border: `2px solid ${courseImage[level?.parent]?.border}`,
                }}
                className="w-20 h-20 text-white py-2 px-4 rounded-lg shadow-md"
              >
                {`Objeto ${index + 1}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sections;
