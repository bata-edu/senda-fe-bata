import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { fetchModulesInfo } from "../../features/module/moduleSlice";
import { useDispatch, useSelector } from "react-redux";
import ArrowRight from "../../assets/icons/arrowRight";
import Left from "../../assets/icons/corchete-izquierdo.svg";
import Right from "../../assets/icons/corchete-derecho.svg";

import { useNavigate } from "react-router-dom";

const Modules = () => {
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.modules);
  const navigate = useNavigate();

  // Colores asignados a cada curso
  const courseColors = {
    Python: {
      primary: "#C694EC",
      secondary: "#D9B9F3",
      text: "black",
    },
    JavaScript: {
      primary: "#C6E635",
      secondary: "#E0F47E",
      text: "black",
    },
    CSS: { primary: "#3D48B8", secondary: "#4558C8", text: "white" },
    Html: { primary: "#EB4624", secondary: "#EE5E37", text: "white" },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("accessToken")) {
        dispatch(fetchModulesInfo());
      }
    };
    fetchData();
  }, [dispatch]);

  const updateSelectedModule = async (moduleId) => {
    localStorage.setItem("selectedModule", moduleId);
    fetchData(moduleId);
  };

  const fetchData = async (moduleId) => {
    navigate("/learn/levels");
  };

  return (
    <>
      <div className="flex flex-col justify-start items-center min-h-screen">
        <div className="text-5xl font-semibold text-gray-800 flex items-center space-x-2 my-12">
          <img src={Left} alt="Corchete izquierdo" className="h-10" />
          <span className="font-mono text-3xl font-medium">
            Comenzá tu curso
          </span>
          <img src={Right} alt="Corchete derecho" className="h-10" />
        </div>
        <section className="w-2/3 relative">
          {modules?.map((module) => {
            const moduleColor = courseColors[module.name]?.primary;
            const percentage =
              module.progress[0]?.courseProgress.toFixed(0) || 59;
            const transparentModuleColor = courseColors[module.name]?.secondary;
            const textColor = courseColors[module.name]?.text;

            return (
              <motion.div
                onClick={() => updateSelectedModule(module.id)}
                key={module.id}
                className={`absolute w-full rounded-[50px] h-[320px] flex flex-col items-center justify-start py-10 px-12`}
                initial={{
                  background: `linear-gradient(
          to right,
          ${moduleColor} 0%, 
          ${transparentModuleColor} 0%
        )`,
                }}
                animate={{
                  background: `linear-gradient(
          to right,
          ${moduleColor} ${percentage}%, 
          ${transparentModuleColor} ${percentage}%
        )`,
                }}
                whileHover={{
                  y: -20,
                }}
                transition={{
                  y: { duration: 0.3, ease: "easeOut" },
                }}
                style={{
                  top: `${modules.indexOf(module) * 210}px`,
                  zIndex: modules.indexOf(module),
                }}
              >
                <div className="flex justify-between w-full">
                  <span
                    onClick={() => updateSelectedModule(module.id)}
                    className={`font-mono text-7xl text-${textColor}`}
                  >
                    {module.name}
                  </span>
                  <span className="font-mono text-3xl text-white">
                    {percentage}%
                  </span>
                </div>
                <div className="flex justify-between w-full mt-4">
                  <div className="flex">
                    {["Label", "Label"].map((tag, i) => (
                      <div
                        key={i}
                        className="border-white border-2 rounded-full flex items-center px-4 mr-3"
                      >
                        <span className="text-xl text-white">{tag}</span>
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
    </>
  );
};

export default Modules;
