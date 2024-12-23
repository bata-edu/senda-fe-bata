import React from "react";

import { getAuthData, logoutUser } from "../../features/auth/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RESET_STATE } from "../../utils/constants";
import Book from "../../assets/icons/book.svg";
import Store from "../../assets/icons/store.svg";
import Trophy from "../../assets/icons/trophy.svg";
import Computer from "../../assets/icons/computer.svg";
import { getCourseLocalStorage } from "../../features/school/schoolSlice";
import calificationIcon from "../../assets/icons/califications.svg";
import pizzaronIcon from "../../assets/icons/pizzaron.svg";
import formIcon from "../../assets/icons/form.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { rank } = useSelector((state) => state.user || {});

  const { user } = getAuthData();
  const course = getCourseLocalStorage() || {};


  const handleLogout = async () => {
    await logoutUser();
    dispatch({ type: RESET_STATE });
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleNavigateExam = () => {
    navigate(`/exam-form/${course.id}`);
}

const handleNavigateCalifications = () => {
    navigate(`/exam-califications/${course.id}`);
}

const handleNavigateTeacherHome = () => {
    navigate(`/teacher/course/${course.id}`);
}

  return (
    <div className="flex flex-col justify-between pr-24 py-4 pl-8">
      <div>
        {user.role === "student" && (
        <div className="flex flex-col space-y-6 cursor-pointer">
          <div className="flex ">
            <img src={Book} alt="Book icon" />
            <span
              className="text-lg font-sans font-medium ml-4 "
              onClick={() => handleNavigation("/home")}
            >
              Aprender
            </span>
          </div>
          <div className="flex">
            <img src={Store} alt="Book icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigation("/home/levels")}
            >
              Tienda
            </span>
          </div>
        </div>
        )}
        {user.role === "teacher" && (
          <div className="flex flex-col space-y-6 cursor-pointer">
            <div className="flex">
            <img src={pizzaronIcon} alt="Pizzaron icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigateTeacherHome()}
            >
              Pizarron
            </span>
          </div>
          <div className="flex">
            <img src={formIcon} alt="Form icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigateExam()}
            >
              Formularios
            </span>
          </div>
          <div className="flex">
            <img src={calificationIcon} alt="Calification icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigateCalifications()}
            >
              Calificaciones
            </span>
          </div>
      </div>
      )}
      {(user && user.role === "student") && (
      <div>
      <div className="">
        <div className="flex mb-8">
          <img src={Trophy} alt="Book icon" />
          <span className="text-lg font-sans font-medium ml-4">
            Liga de puntos
          </span>
        </div>
        <div className="flex flex-col space-y-3">
          {rank && rank.length
            ? rank.map((rankUser, index) => (
                <div
                  key={rankUser.id}
                  className={`flex text-base font-medium ${
                    rankUser.id === user?.id
                      ? "text-red-500"
                      : "text-darkGrayText"
                  } `}
                >
                  <p className="w-8">{rankUser.points}</p>
                  <span className="ml-2">{rankUser.name}</span>
                </div>
              ))
            : null}
        </div>
      </div>
      <div>
        <div className="flex">
          <img src={Computer} alt="Book icon" />
          <span>Mi pagina web</span>
        </div>
      </div>
      </div>
      )}
    </div>
    </div>
  );
};

export default Sidebar;
