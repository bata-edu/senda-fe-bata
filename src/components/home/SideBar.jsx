import React from "react";

import { getAuthData, 
  // logoutUser 
} from "../../features/auth/authService";
import { Navigate, useNavigate } from "react-router-dom";
// import { useDispatch, 
  // useSelector 
// } from "react-redux";
// import { RESET_STATE } from "../../utils/constants";
import Book from "../../assets/icons/book.svg";
import Store from "../../assets/icons/store.svg";
import Trophy from "../../assets/icons/trophy.svg";
// import Computer from "../../assets/icons/computer.svg";
import { getCourseLocalStorage } from "../../features/school/schoolSlice";
import calificationIcon from "../../assets/icons/califications.svg";
import pizzaronIcon from "../../assets/icons/pizzaron.svg";
import formIcon from "../../assets/icons/form.svg";
import taskIcon from "../../assets/icons/task.svg";

const Sidebar = ({className}) => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const { rank } = useSelector((state) => state.user || {});

  const { user } = getAuthData();
  const course = getCourseLocalStorage() || {};

  // const handleLogout = async () => {
  //   await logoutUser();
  //   dispatch({ type: RESET_STATE });
  //   navigate("/login");
  // };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleNavigateExam = () => {
    navigate(`/exam-form/${course.id}`);
  };

  const handleNavigateCalifications = () => {
    navigate(`/exam-califications/${course.id}`);
  };

  const handleNavigateTeacherHome = () => {
    navigate(`/teacher/course/${course.id}`);
  };

  const handleNavigateTask = () => {
    navigate(`/task-form/${course.id}`);
  };

  if (!user) return(<Navigate to={'/login'}></Navigate>)
  return (
    <div className={`flex flex-col justify-between px-8 pt-4 ${className}`}>
      <div>
        {user && user.role === "student" && (
          <div className="flex flex-col gap-6 lg:min-w-64 mx-auto">
            <div className="flex cursor-pointer">
              <img src={Book} alt="Book icon" />
              <span
                className="text-lg font-sans font-medium ml-4 "
                onClick={() => handleNavigation("/home")}
              >
                Aprender
              </span>
            </div>
            <div className="flex text-gray-600 opacity-25 pointer-events-none select-none">
              <img src={Store} alt="Book icon" />
              <span
                className="text-lg font-sans font-medium ml-4"
                onClick={() => handleNavigation("/home/levels")}
              >
                Tienda
              </span>
            </div>
            {/* <div>
              <div className="flex mb-4">
                <img src={Trophy} alt="Book icon" />
                <span className="text-lg font-sans font-medium ml-4">
                  Liga de puntos
                </span>
              </div>
              <div className="flex flex-col ">
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
            </div> */}
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
              <img src={taskIcon} alt="Form icon" />
              <span
                className="text-lg font-sans font-medium ml-4"
                onClick={() => handleNavigateTask()}
              >
                Tareas
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
            <div className="flex">
            <img src={Trophy} alt="Book icon" />
            <span
              className="text-lg font-sans font-medium ml-4"
              onClick={() => handleNavigation("/teacher/league")}
            >
              Ligas
            </span>
          </div>
          </div>
        )}
        {/* {user && user.role === "student" && (
          <div>
            <div className="flex mb-4">
              <img src={Trophy} alt="Book icon" />
              <span className="text-lg font-sans font-medium ml-4">
                Liga de puntos
              </span>
            </div>
            <div className="flex flex-col ">
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
        )} */}

      </div>
    </div>
  );
};

export default Sidebar;
