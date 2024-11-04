import React, { useState, useEffect } from "react";
import "../../styles/modules.css";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchModulesInfo,
  setSelectedModule,
} from "../../features/module/moduleSlice";
import { getIntoCourse } from "../../features/school/schoolSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProgress } from "../../features/userProgress/userProgressSlice";

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

  const handleJoinClassroom = async () => {
    if (classroomCode.trim()) {
      setLoading(true);
      try {
        await dispatch(getIntoCourse({ courseCode: classroomCode }));
        setClassroomCode("");
      } catch (error) {
        console.error("Error joining classroom:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a valid classroom code.");
    }
  };

  return (
    <div className="code-editor-container">
      <div className="join-classroom">
        <input
          type="text"
          placeholder="Enter classroom code"
          value={classroomCode}
          onChange={(e) => setClassroomCode(e.target.value)}
          className="form-control"
        />
        <button onClick={handleJoinClassroom} className="btn btn-primary">
          Join Classroom
        </button>
      </div>

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
