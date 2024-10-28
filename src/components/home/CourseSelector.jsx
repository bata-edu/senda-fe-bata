import React, { useEffect } from "react";
import "../../styles/modules.css";

import "react-toastify/dist/ReactToastify.css";
import {
  fetchModulesInfo,
  setSelectedModule,
} from "../../features/module/moduleSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProgress } from "../../features/userProgress/userProgressSlice";

const Modules = () => {
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.modules);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchModulesInfo());
    };
    fetchData();
  }, [dispatch]);

  const updateSelectedModule = async (moduleId) => {
    dispatch(setSelectedModule(moduleId));
    dispatch(fetchUserProgress());
  };

  return (
    <div className="code-editor-container">
      {modules?.map((module) => (
        <div>
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
