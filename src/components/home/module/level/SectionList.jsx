import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectLevels, fetchLevels, fetchSections, fetchModules } from "../../../../features/module/moduleSlice";
import MouseWhite from "../../../../assets/icons/white/mouse-white.svg";
import KeyBoardWhite from "../../../../assets/icons/white/keyboard-white.svg";
import DisplayWhite from "../../../../assets/icons/white/display-white.svg";
import BookWhite from "../../../../assets/icons/white/book-white.svg";
import LoadingPage from "../../../../pages/LoadingPage";
import { GuideViewer } from "./section/Guide"
import ArrowBack from "../../../../assets/icons/arrowBack.svg";
import { fetchUserProgress, clearSectionProgress } from "../../../../features/userProgress/userProgressSlice";
export const SectionList = () => {
  const { moduleSlug, levelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modules } = useSelector((state) => state.modules);
  const { progress } = useSelector((state) => state.userProgress || {});
  const levels = useSelector((state) => selectLevels(state, moduleSlug));
  const [level, setLevel] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Cargando nivel...");

    const courseImage = {
    "python": {
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
    "javascript": {
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
    "css": {
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
    "html": {
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
    if (!modules || !modules.by_slug?.[moduleSlug]) {
      setLoadingMessage("Cargando módulo...")
      dispatch(fetchModules())
      return;
    }
    if (!levels || !levels[levelId]) {
      setLoadingMessage("Cargando nivel...")
      dispatch(fetchLevels(moduleSlug))
      return;
    }
    
    if (!levels || !levels[levelId] || !levels[levelId].sections) {
      setLoadingMessage("Cargando secciones...")
      dispatch(fetchSections(levelId))
      return;
    }

    if (!progress || !progress[moduleSlug] || !progress[moduleSlug].current_section_id) {
      setLoadingMessage("Cargando progreso...")
      dispatch(fetchUserProgress())
      return;
    }

    const currentSectionIndex = levels[levelId].sections[progress[moduleSlug].current_section_id].order;
    setLevel(levels[levelId]);
    setCurrentSectionIndex(currentSectionIndex);
    setLoading(false);
  
  }, [levels, levelId, progress, moduleSlug, dispatch, modules, level]);

  if (loading) {
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <LoadingPage message={loadingMessage} />
      </div>
    );
  }
  const handleSectionClick = (sectionId) => {
    dispatch(clearSectionProgress(sectionId));
    navigate(`/learn/modules/${moduleSlug}/levels/${levelId}/sections/${sectionId}`);
  };

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div
        style={{
          background: courseImage[moduleSlug].backgroundCurrent,
          border: `2px solid ${courseImage[moduleSlug].backgroundDone}`,
        }}
        className={`max-w-md flex flex-col py-3 px-6 mt-4 rounded-xl border-2 border-[#F9BEA8] w-full`}
      >
        <div className="w-full flex justify-between items-center">
          <button
            onClick={() => navigate(`/learn/modules/${moduleSlug}`)}
            className="flex items-center"
          >
            <img src={ArrowBack} alt="arrow back" />
            <span className={`text-white text-lg font-sans ml-2 font-medium`}>
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
        {level?.sections && Object.values(level?.sections)?.map((section, index) => {
          const position = index % 5;
          const rowOffset = Math.floor(index / 5) * 300;
          const sectionIndex = index;

          const borderColor =
            currentSectionIndex > sectionIndex
              ? courseImage[moduleSlug].border
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
                    borderLeft: "4px dashed gray",
                    borderBottom: "4px dashed gray",
                    borderTop: "none",
                    borderRight: "none",
                    borderColor: borderColor,
                    width: "60px",
                    height: "60px",
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
                    top: "50%",
                    left: "100%",
                    width: "60px",
                    height: "60px",
                    borderTop: "4px dashed gray",
                    borderRight: "4px dashed gray",
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
              onClick={() => handleSectionClick(section.id)}
              key={section.id}
              className={`${className} ${sectionIndex > currentSectionIndex ? "pointer-events-none" : "cursor-pointer"}`}
              style={{ top: `calc(${top} + ${rowOffset}px)` }}
            >
              {extra}
              <div
                style={{
                  background: (() => {
                    if (sectionIndex < currentSectionIndex || currentSectionIndex === -1) {
                      return courseImage[moduleSlug]?.backgroundDone;
                    } else if (sectionIndex === currentSectionIndex) {
                      return courseImage[moduleSlug]?.backgroundCurrent;
                    } else {
                      return "";
                    }
                  })(),
                  border: `2px solid ${courseImage[moduleSlug]?.border}`,
                }}
                className={`w-20 h-20 text-white py-2 px-4 rounded-lg shadow-md`}
              >
                {courseImage[moduleSlug]?.icons[iconIndex]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};