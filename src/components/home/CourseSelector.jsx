import React, { useState, useEffect } from "react";
import "../../styles/modules.css";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchModulesInfo,
} from "../../features/module/moduleSlice";
import { useDispatch, useSelector } from "react-redux";

const Modules = ({ setLoading, fetchModuleInfo }) => {
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.modules);
  const [classroomCode, setClassroomCode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("accessToken")) {
        dispatch(fetchModulesInfo());
      }
    };
    fetchData();
  }, [dispatch]);

  const updateSelectedModule = async (moduleId) => {
    setLoading(true);
    localStorage.setItem("selectedModule", moduleId);
    fetchModuleInfo(moduleId);
    setLoading(false);
  };

  return (
    <div className="code-editor-container">
      {modules?.map((module) => (
        <div key={module.id}>
          <span
            onClick={() => updateSelectedModule(module.id)}
            className="module-title"
          >
            {module.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Modules;
