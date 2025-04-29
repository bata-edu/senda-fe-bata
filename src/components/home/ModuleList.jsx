import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { fetchModules, clearLevels } from "../../features/module/moduleSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProgress, selectProgress } from "../../features/userProgress/userProgressSlice";
import { useNavigate } from "react-router-dom";
import ArrowRight from "../../assets/icons/arrowRight";
import Left from "../../assets/icons/corchete-izquierdo.svg";
import Right from "../../assets/icons/corchete-derecho.svg";
import LoadingPage from "../../pages/LoadingPage";

const courseColors = {
  Python: {
    primary: "#C694EC",
    secondary: "#D9B9F3",
    text: "black",
    svg: "#5B2B78",
  },
  JavaScript: {
    primary: "#C6E635",
    secondary: "#E0F47E",
    text: "black",
    svg: "#425314",
  },
  CSS: { 
    primary: "#3D48B8", 
    secondary: "#4558C8", 
    text: "white", 
    svg: "#222449",
  },
  HTML: { 
    primary: "#EB4624", 
    secondary: "#EE5E37", 
    text: "white",
    svg: "#761A18" 
  },
  "HTML V2": { 
    primary: "#EB4624", 
    secondary: "#EE5E37", 
    text: "white", 
    svg: "#761A18" 
  },
};

export const ModuleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modules } = useSelector((state) => state.modules);
  const progress = useSelector(selectProgress);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => { 
      if (isMounted) {
        dispatch(fetchModules());
        dispatch(fetchUserProgress());
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleModuleClick = (slug) => {
    // dispatch(clearLevels(slug));
    navigate(`/learn/modules/${slug}`);
  };

  if (!modules) return <LoadingPage message="Cargando módulos..." />;
  const moduleList = Object.values(modules) 
  if (!moduleList) return <LoadingPage message="Cargando módulos..." />;
  if (!progress) return <LoadingPage message="Cargando progreso..." />;

  return (
    <div className="flex flex-col justify-start items-center px-4 mt-12 md:mt-32 h-full">
      <div className="font-semibold text-gray-800 flex items-center gap-5 mb-12">
        <img src={Left} alt="Corchete izquierdo" className="h-10" />
        <span className="font-mono text-center text-4xl sm:text-5xl font-medium">
          Comienza tu curso
        </span>
        <img src={Right} alt="Corchete derecho" className="h-10" />
      </div>
      <section className="w-full mx-auto max-w-4xl relative">
        {Object.values(modules)?.map((module, index) => {
          const moduleProgress = progress[module._id];
          const percentage = moduleProgress?.courseProgress.toFixed(0) || 0;
          const moduleColor = courseColors[module.name]?.primary;
          const transparentModuleColor = courseColors[module.name]?.secondary;
          const textColor = courseColors[module.name]?.text;

          return (
            <motion.div
              onClick={() => handleModuleClick(module.slug)}
              key={module.id}
              className="absolute w-full cursor-pointer rounded-[50px] h-[300px] flex flex-col items-center justify-start py-10 px-6 sm:px-12"
              initial={{
                background: `linear-gradient(to right, ${moduleColor} 0%, ${transparentModuleColor} 0%)`,
              }}
              animate={{
                background: `linear-gradient(to right, ${moduleColor} ${percentage}%, ${transparentModuleColor} ${percentage}%)`,
              }}
              whileHover={{ y: -20 }}
              transition={{ y: { duration: 0.3, ease: "easeOut" } }}
              style={{
                top: `${index * 210}px`,
                zIndex: index,
              }}
            >
              <div className="flex justify-between w-full">
                <span
                  className="font-mono text-5xl sm:text-7xl max-w-[6ch] sm:max-w-full truncate"
                  style={{ color: textColor }}
                >
                  {module.name}
                </span>
                <span className="font-mono text-3xl" style={{ color: textColor }}>
                  {percentage}%
                </span>
              </div>
              <div className="flex justify-between w-full mt-4 gap-2">
                <div className="flex gap-1 sm:gap-3">
                  {["Label", "Label"].map((tag, i) => (
                    <div
                      key={i}
                      className="border-2 rounded-full flex items-center px-4"
                      style={{ borderColor: textColor, color: textColor }}
                    >
                      <span className="text-xl">{tag}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <ArrowRight color={textColor} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
};
