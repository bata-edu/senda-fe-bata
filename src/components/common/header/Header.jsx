import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../../assets/logo.svg";
import Clasroom from "../../../assets/icons/aula.svg";
import FreeCode from "../../../assets/icons/codeo-libre.svg";
import Courses from "../../../assets/icons/cursos.svg";
import Settings from "../../../assets/icons/settings.svg";
import Bell from "../../../assets/icons/bell.svg";
import { getAuthData, logoutUser } from "../../../features/auth/authService";

const Header = ({className}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = getAuthData();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  let activeButtonClassName = "bg-grayBg border-borderGray border-1"
  if (isActive("/editor")) {
    activeButtonClassName = "bg-[#2F414A] border-[#385966] border-1"
  }

  return (
    <header className={`w-full ${isActive("/editor") ? "bg-darkHeader border-[#535D67] text-lightGray" : "bg-white border-borderGray"} shadow-sm border-b  flex items-center p-4 h-[10vh]`}>
      <div className="flex items-center w-24">
        <img src={logoImage} alt="Logo Bata" className="h-8" />
      </div>
      {user && (
        <>
          <div className="flex justify-center items-center mx-auto">
            <button
              className={`flex items-center mx-1 p-2 rounded ${
                isActive("/learn/modules")
                  ? activeButtonClassName
                  : ""
              }`}
              onClick={() => navigateTo("/learn/modules")}
            >
              <img src={Courses} alt="Cursos" className="h-6" />
              <span className="font-semibold ml-2">Cursos</span>
            </button>
            {user.role === "student" && (
              <button
                className={`flex items-center mx-1 p-2 rounded ${
                  isActive("/classroom")
                    ? "bg-grayBg border-borderGray border-1"
                    : ""
                }`}
                onClick={() => navigateTo("/classroom")}
              >
                <img src={Clasroom} alt="Aula" className="h-6" />
                <span className="font-semibold ml-2">Aula</span>
              </button>
            )}
            <button
              className={`flex items-center mx-1 p-2 rounded ${
                isActive("/editor")
                  ? activeButtonClassName
                  : ""
              }`}
              onClick={() => navigateTo("/editor")}
            >
              <img src={FreeCode} alt="Codeo Libre" className="h-6" />
              <span className="font-semibold ml-2">Codeo Libre</span>
            </button>
            {user.role === "teacher" && (
              <button
                className={`flex items-center mx-1 p-2 rounded ${
                  isActive("/teacher")
                    ? activeButtonClassName
                    : ""
                }`}
                onClick={() => {
                  localStorage.removeItem("school");
                  localStorage.removeItem("course");
                  navigateTo("/teacher");
                }}
              >
                <img src={FreeCode} alt="Codeo Libre" className="h-6" />
                <span className="font-semibold ml-2">Instrucciones</span>
              </button>
            )}
          </div>

          <div className="flex justify-end items-center gap-2 w-24">
            <img
              src={Settings}
              alt="Ajustes"
              className="h-6 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute top-12 right-0 bg-white shadow-md rounded w-40 p-2">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
            <img src={Bell} alt="Notificaciones" className="h-6" />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
