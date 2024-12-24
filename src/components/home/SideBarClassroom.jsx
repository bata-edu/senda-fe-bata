import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import pizarronIcon from "../../assets/icons/pizzaron.svg";
import calificationIcon from "../../assets/icons/califications.svg";
import formIcon from "../../assets/icons/form.svg";
import Trophy from "../../assets/icons/trophy.svg";
import examIcon from "../../assets/icons/exam.svg";
import taskIcon from "../../assets/icons/task.svg";



const SideBarClassroom = () => {
  const navigate = useNavigate();
  const { rank } = useSelector((state) => state.user || {});

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col justify-between pr-24 py-4 pl-8">
      <div>
        <div className="flex flex-col space-y-6 cursor-pointer">
          <div className="flex">
            <img src={pizarronIcon} alt="Pizarrón icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigation("/classroom/board")}
            >
              Pizarrón
            </span>
          </div>
          <div className="flex">
            <img src={taskIcon} alt="Tareas icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigation("/classroom/tasks")}
            >
              Tareas
            </span>
          </div>
          <div className="flex">
            <img src={formIcon} alt="Trabajos prácticos icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigation("/classroom/practices")}
            >
              Trabajos Prácticos
            </span>
          </div>
          <div className="flex">
            <img src={examIcon} alt="Exámenes icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigation("/classroom/exams")}
            >
              Exámenes
            </span>
          </div>
          <div className="flex">
            <img src={calificationIcon} alt="Calificaciones icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigation("/classroom/grades")}
            >
              Calificaciones
            </span>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex mb-8">
            <img src={Trophy} alt="Liga icon" />
            <span className="text-lg font-sans font-medium ml-4">
              Ligas
            </span>
          </div>
          <div className="flex flex-col space-y-3">
            {rank && rank.length
              ? rank.map((rankUser) => (
                  <div
                    key={rankUser.id}
                    className={`flex text-base font-medium ${
                      rankUser.id === rankUser.currentUserId
                        ? "text-red-500"
                        : "text-darkGrayText"
                    }`}
                  >
                    <p className="w-8">{rankUser.points}</p>
                    <span className="ml-2">{rankUser.name}</span>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarClassroom;
