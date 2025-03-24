import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchLevelInfo,
  // fetchAllLevels,
} from "../../../../features/level/levelSlice";
import {
  fetchUserProgressById,
  // startCourse,
} from "../../../../features/userProgress/userProgressSlice";
import MouseWhite from "../../../../assets/icons/white/mouse-white.svg";
import KeyBoardWhite from "../../../../assets/icons/white/keyboard-white.svg";
import DisplayWhite from "../../../../assets/icons/white/display-white.svg";
import BookWhite from "../../../../assets/icons/white/book-white.svg";
// import { clearSections } from '../../features/section/sectionSlice';
import LoadingPage from "../../../../pages/LoadingPage";
import { GuideViewer } from "./section/Guide"
import ArrowBack from "../../../../assets/icons/arrowBack.svg";

export const SectionList = () => {
  const { moduleId, levelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProgress } = useSelector((state) => state.userProgress || {});
  
  const [loading, setLoading] = useState(false);
  const [showNoMoreLevels, setShowNoMoreLevels] = useState(false);
  const [level, setLevel] = useState(null);
  const courseImage = {
    "671909eecc62ee9e8f06c578": {
      course: "Python",
      border: "#C694EC",
      backgroundCurrent: "#9B4CD1",
      backgroundDone: "#FBF6FE",
      text: "white",
      icons: [
        <img src={MouseWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={KeyBoardWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={DisplayWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={BookWhite} alt="Logo Bata" className="h-16 mx-auto " />,
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
        <img src={KeyBoardWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={DisplayWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={BookWhite} alt="Logo Bata" className="h-16 mx-auto " />,
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
        <img src={KeyBoardWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={DisplayWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={BookWhite} alt="Logo Bata" className="h-16 mx-auto " />,
      ],
    },
    "676ee8640324ad0b3cda0bc6": {
      course: "Html",
      border: "#F59D7C",
      backgroundCurrent: "#EB4624",
      backgroundDone: "#FEF5F2",
      text: "white",
      icons: [
        <img src={MouseWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={KeyBoardWhite} alt="Logo Bata" className="h-16  mx-auto " />,
        <img src={DisplayWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={BookWhite} alt="Logo Bata" className="h-16 mx-auto " />,
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
        <img src={KeyBoardWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={DisplayWhite} alt="Logo Bata" className="h-16 mx-auto " />,
        <img src={BookWhite} alt="Logo Bata" className="h-16 mx-auto " />,
      ],
    },
  };

  useEffect(() => {
    const fetchData = async (moduleId) => {
      setLoading(true);
        try {
          await dispatch(fetchUserProgressById(moduleId)).unwrap();
          const levelResponse = await dispatch(fetchLevelInfo({ moduleId: moduleId, page: 0, limit: 10 })).unwrap();
          if (levelId && levelResponse.levels?.length) {
            const selectedLevel = levelResponse.levels.find(lvl => lvl._id === levelId);
            if (selectedLevel) {
              setLevel(selectedLevel);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
    };

    if (moduleId && levelId) {
      fetchData(moduleId);
    }
  }, [levelId, dispatch, moduleId]);

  useEffect(() => {
    if (showNoMoreLevels) {
      const timer = setTimeout(() => {
        setShowNoMoreLevels(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNoMoreLevels]);
  
  if (loading) return (        
    <div className="w-full h-[90vh] flex justify-center items-center">
      <LoadingPage />
    </div>
  );

  return(
    <div className="flex flex-col w-full h-full items-center">
            <div
              style={{
                background: courseImage[moduleId].backgroundCurrent,
                border: `2px solid ${courseImage[moduleId].backgroundDone}`,
              }}
              className={`max-w-md flex flex-col py-3 px-6 mt-4 rounded-xl border-2 border-[#F9BEA8] w-full`}
            >
              <div className="w-full flex justify-between items-center">

                <button
                  onClick={() => navigate(`/learn/modules/${moduleId}`)}
                  className="flex items-center"
                >
                  <img src={ArrowBack} alt="arrow back" />
                  <span
                    className={`text-white  text-lg font-sans ml-2 font-medium`}
                  >
                    Volver
                  </span>
                </button>
                <GuideViewer guide={level?.guide} />
              </div>
              <div className="text-white font-mono text-2xl">
                Nivel {level?.order}: {level?.name}
              </div>

            </div>

      <div className="relative w-full h-auto flex justify-center items-start mt-12">
        {level?.sections?.map((section, index) => {
          const position = index % 5;
          const rowOffset = Math.floor(index / 5) * 300;
          const currentSectionIndex = level?.sections?.findIndex(
            (sec) => sec._id === currentProgress?.currentSection
          );
          const sectionIndex = index;

          const borderColor =
            currentSectionIndex > sectionIndex
              ? courseImage[moduleId].border
              : "#C8C8C8";

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
                    borderColor: borderColor,
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
                    borderColor: borderColor,
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
                    borderColor: borderColor,
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
                    borderColor: borderColor,
                  }}
                ></div>
              ),
            },
          ];
          const iconIndex = index % 4;
          const { className, top, extra } = positions[position];
          return (
            <div
              onClick={() => {
                navigate(`sections/${section._id}`);
                localStorage.setItem("sectionName", section.name);
                localStorage.setItem("sectionOrder", section.order);
              }}
              key={index}
              className={`${className} ${sectionIndex > currentSectionIndex ? "pointer-events-none" : ""}`}
              style={{ top: `calc(${top} + ${rowOffset}px)` }}
            >
              {extra}
              <div
                style={{
                  background: (() => {
                    if (sectionIndex < currentSectionIndex || currentSectionIndex === -1) {
                      return courseImage[moduleId]?.backgroundDone; // Antes de la sección actual
                    } else if (sectionIndex === currentSectionIndex) {
                      return courseImage[moduleId]?.backgroundCurrent; // Sección actual
                    } else {
                      return ""; // Después de la sección actual
                    }
                  })(),
                  border: `2px solid ${courseImage[moduleId]?.border}`,
                }}
                className={`w-20 h-20 text-white py-2 px-4 rounded-lg shadow-md`}
              >
                {courseImage[moduleId]?.icons[iconIndex]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};