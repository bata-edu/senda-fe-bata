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
import MouseWhite from "../../assets/icons/mouse-white.svg";

const Sections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { levelsInfo = [], page } = useSelector((state) => state.level || {});
  const { currentProgress, courseId } = useSelector(
    (state) => state.userProgress || {}
  );

  const [hasMoreLevels, setHasMoreLevels] = useState(true);
  const [showNoMoreLevels, setShowNoMoreLevels] = useState(false);
  const levelRefs = useRef({});
  const [level, setLevel] = useState(false);

  const [userCurrentInfo, setUserCurrentInfo] = useState({
    currentLevelIndex: 0,
    currentSectionIndex: 0,
    lastSectionIndex: 0,
  });
  const selectedModule = localStorage.getItem("selectedModule");

  const courseImage = {
    "671909eecc62ee9e8f06c578": {
      course: "Python",
      border: "#C694EC",
      backgroundCurrent: "#9B4CD1",
      backgroundDone: "#FBF6FE",
      text: "white",
      icons: [
        <img src={MouseWhite} alt="Logo Bata" className="h-16 mx-auto " />,
      ],
    },
    "67190a2ecc62ee9e8f06c57b": {
      course: "JavaScript",
      border: "#EBF99D",
      backgroundCurrent: "#EBF99D",
      backgroundDone: "#C6E635",
      text: "white",
      icons: [
        <img src={MouseWhite} alt="Logo Bata" className="h-16 mx-auto " />,
      ],
    },
    "6749b2b80a8216bdad69e17b": {
      course: "Css",
      border: "#7B97DF",
      backgroundCurrent: "#3D48B8",
      backgroundDone: "#3D48B8",
      text: "white",
      icons: [
        <img src={MouseWhite} alt="Logo Bata" className="h-16 mx-auto " />,
      ],
    },
    "66fc2fb14c227e973f81b4d1": {
      course: "Html",
      border: "#F59D7C",
      backgroundCurrent: "#EB4624",
      backgroundDone: "#FEF5F2",
      text: "white",
      icons: [
        <img src={MouseWhite} alt="Logo Bata" className="h-16 mx-auto " />,
      ],
    },
  };
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
    if (selectedModule && !levelsInfo) {
      fetchData(selectedModule);
    }
  }, []);

  useEffect(() => {
    if (levelsInfo && levelsInfo.length) {
      setLevelInfo();
    }
  }, [levelsInfo]);

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
  return (
    <div className="flex flex-col w-full h-full items-center">
      <div
        style={{
          background: courseImage[selectedModule].backgroundCurrent,
          border: `2px solid ${courseImage[selectedModule].border}`,
        }}
        className="flex flex-col py-4 px-6  mt-4 rounded-xl  w-[480px]"
      >
        <div onClick={() => navigate(`/learn/levels`)}>
          <span className={`text-${courseImage[selectedModule].text}`}>
            Volver a Niveles
          </span>
        </div>
      </div>
      <div className="relative w-full h-auto flex justify-center items-start mt-12">
        {level?.sections?.map((section, index) => {
          const position = index % 5;
          const rowOffset = Math.floor(index / 5) * 300;

          const positions = [
            {
              className:
                "absolute left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center",
              top: "0px",
              extra: (
                <div
                  className="w-1 h-20 relative ml-[58px]"
                  style={{
                    borderLeft: "4px dashed gray", // Borde izquierdo
                    borderBottom: "4px dashed gray", // Borde inferior
                    borderTop: "none",
                    borderRight: "none",
                    borderColor: courseImage[selectedModule].border,
                    width: "60px", // Ajusta el ancho para la base de la "L"
                    height: "60px", // Ajusta la altura para la parte vertical de la "L"
                  }}
                ></div>
              ),
            },
            {
              className:
                "absolute left-[55%] flex flex-col items-center -mt-[14px]",
              top: "110px",
              extra: (
                <div
                  style={{
                    position: "absolute",
                    top: "50%", // Centrado verticalmente dentro del contenedor
                    left: "100%", // Justo a la derecha del contenido
                    width: "60px", // Longitud de la línea horizontal
                    height: "60px", // Altura 0 ya que es solo una línea
                    borderTop: "4px dashed gray", // Línea discontinua usando border
                    borderRight: "4px dashed gray", // Línea discontinua usando border
                    borderColor: courseImage[selectedModule].border,
                  }}
                ></div>
              ),
            },
            {
              className:
                "absolute mt-16 left-[63.3%] flex flex-col items-center",
              top: "132px",
              extra: <></>,
            },

            {
              className:
                "absolute left-[55.5%] flex flex-col items-center z-[10]",
              top: "295px",
              extra: (
                <div
                  className="w-1 h-20 absolute ml-32 -mt-4"
                  style={{
                    borderRight: "4px dashed gray",
                    borderBottom: "4px dashed gray",
                    borderTop: "none",
                    width: "60px",
                    height: "60px",
                    borderColor: courseImage[selectedModule].border,
                  }}
                ></div>
              ),
            },
            {
              className:
                "absolute left-[50%] transform -translate-x-1/2 flex flex-col items-center",
              top: "390px",
              extra: (
                <div
                  className="w-1 h-20 absolute ml-[70px] -mt-[55px]"
                  style={{
                    borderLeft: "4px dashed gray",
                    borderTop: "4px dashed gray",
                    width: "60px",
                    height: "60px",
                    borderColor: courseImage[selectedModule].border,
                  }}
                ></div>
              ),
            },
          ];

          const { className, top, extra } = positions[position];
          return (
            <div
              onClick={() => {
                navigate(`/learn/progress?section=${section._id}&current=true`);
                localStorage.setItem("sectionName", section.name);
                localStorage.setItem("sectionOrder", section.order);
              }}
              key={index}
              className={`${className}`}
              style={{ top: `calc(${top} + ${rowOffset}px)` }}
            >
              {extra}
              <div
                style={{
                  background:
                    index === userCurrentInfo.currentSectionIndex
                      ? courseImage[selectedModule]?.backgroundCurrent
                      : courseImage[selectedModule]?.backgroundDone,
                  border: `2px solid ${courseImage[selectedModule]?.border}`,
                }}
                className="w-20 h-20 text-white py-2 px-4 rounded-lg shadow-md"
              >
                {courseImage[selectedModule]?.icons[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sections;
