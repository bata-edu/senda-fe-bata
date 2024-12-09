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
        <span>{level?.order}</span>
      </div>
      <div className="relative w-full h-[500px] flex justify-center items-start mt-12">
        {/* Objeto 1 */}
        <div className="absolute  top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="bg-blue-500 w-20 h-20 text-white py-4 px-4 rounded-lg shadow-md">
            Objeto 1
          </div>
          {/* Línea hacia abajo */}
          <div className="w-px h-12 border-dotted border-2 border-gray-300"></div>
        </div>
        {/* Objeto 2 (derecha abajo) */}
        <div className="absolute top-[70px] left-[55%] flex flex-col items-center">
          {/* Línea horizontal desde Objeto 1 */}
          <div className="absolute -left-[50px] top-[20px] transform -translate-y-1/2 w-[50px] border-t-2 border-dotted border-gray-300"></div>
          <div className="bg-blue-500 w-20 h-20 text-white py-2 px-4 rounded-lg shadow-md">
            Objeto 2
          </div>
          <div className="absolute left-[110px] top-[20px] transform -translate-y-1/2 w-[50px] border-t-2 border-dotted border-gray-300"></div>
        </div>
        {/* Objeto 3 (abajo al centro) */}
        <div className="absolute top-[90px] left-[65%] flex flex-col items-center">
          <div className="w-px h-12 border-dotted border-2 border-gray-300"></div>

          <div className="bg-blue-500 w-20 h-20 text-white py-2 px-4 rounded-lg shadow-md">
            Objeto 3
          </div>
          <div className="w-px h-12 border-dotted border-2 border-gray-300"></div>
          <div className="absolute left-[0px] top-[140px] transform -translate-y-1/2 w-[50px] border-t-2 border-dotted border-gray-300"></div>
        </div>

        {/* <div className="absolute top-[250px] left-[45%] w-[100px] border-t-2 border-dotted border-gray-300"></div> */}
        {/* Objeto 4 (derecha de Objeto 3) */}
        <div className="absolute top-[200px] left-[55%] flex flex-col items-center">
          <div className="absolute -left-[50px] top-[20px] transform -translate-y-1/2 w-[50px] border-t-2 border-dotted border-gray-300"></div>

          <div className="bg-blue-500 w-20 h-20 text-white py-2 px-4 rounded-lg shadow-md">
            Objeto 4
          </div>
        </div>
        {/* Línea hacia abajo desde Objeto 4 */}
        <div className="absolute top-[220px] left-[50%] w-px h-12 border-dotted border-2 border-gray-300"></div>
        {/* Nodo final */}
      </div>
    </div>
  );
};

export default Sections;
