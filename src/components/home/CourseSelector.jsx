import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { fetchModulesInfo } from "../../features/module/moduleSlice";
import { useDispatch, useSelector } from "react-redux";
import ArrowRight from "../../assets/icons/arrowRight";
import Left from "../../assets/icons/corchete-izquierdo.svg";
import Right from "../../assets/icons/corchete-derecho.svg";
import { fetchUserProgressById } from "../../features/userProgress/userProgressSlice.js";
import {
  fetchAllLevels,
  fetchLevelInfo,
} from "../../features/level/levelSlice.js";
import { useNavigate } from "react-router-dom";

const Modules = () => {
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.modules);
  const navigate = useNavigate();

  // Colores asignados a cada curso
  const courseColors = {
    Python: "#D9B9F3",
    JavaScript: "#F6FCCB",
    CSS: "#4558C8",
    Html: "#EE5E37",
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
    await Promise.all([
      dispatch(fetchUserProgressById(moduleId)),
      dispatch(fetchLevelInfo({ courseId: moduleId, page: 0, limit: 3 })),
      dispatch(fetchAllLevels({ courseId: moduleId })),
    ]);
    navigate("/learn/levels");
  };

  return (
    <>
      <div className="flex flex-col justify-start items-center h-screen bg-gray-100 ">
        <div className="text-5xl font-semibold text-gray-800 flex items-center space-x-2 my-12">
          <img src={Left} alt="Corchete izquierdo" className="h-10" />
          <span>Comenzá tu curso</span>
          <img src={Right} alt="Corchete derecho" className="h-10" />
        </div>
        <section className="w-2/3 relative">
          {modules?.map((module) => {
            const moduleColor = courseColors[module.name] || "gray"; // Color predeterminado si no está asignado

            return (
              <motion.div
                onClick={() => updateSelectedModule(module.id)}
                key={module.id}
                className={`absolute w-full rounded-[50px] h-[300px] flex flex-col items-center justify-start py-10 px-12`}
                style={{
                  top: `${modules.indexOf(module) * 180}px`,
                  zIndex: modules.indexOf(module),
                  backgroundColor: moduleColor,
                }}
                whileHover={{
                  y: -20,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between w-full">
                  <span
                    onClick={() => updateSelectedModule(module.id)}
                    className="font-mono text-5xl text-white"
                  >
                    {module.name}
                  </span>
                  <span className="font-mono text-3xl text-white">
                    {module.percentage || 0}%
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
                    <ArrowRight color={"white"} />
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
