import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../../assets/logo.svg";
import Clasroom from "../../../assets/icons/aula.svg";
import FreeCode from "../../../assets/icons/codeo-libre.svg";
import Courses from "../../../assets/icons/cursos.svg";
import Settings from "../../../assets/icons/settings.svg";
import Bell from "../../../assets/icons/bell.svg";
import { getAuthData } from "../../../features/auth/authService";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = getAuthData();

  const isActive = (path) => location.pathname === path;

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-borderGray flex items-center p-4">
      <div className="flex items-center w-24">
        <img src={logoImage} alt="Logo Bata" className="h-8" />
      </div>
      {user && (
        <>
          <div className="flex justify-center items-center mx-auto">
            <button
              className={`flex items-center mx-1 p-2 rounded ${
                isActive("/learn/modules")
                  ? "bg-grayBg border-borderGray border-1"
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
                  isActive("/classroom") ? "bg-grayBg border-borderGray border-1" : ""
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
                  ? "bg-grayBg border-borderGray border-1"
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
                  isActive("/teacher") ? "bg-grayBg border-borderGray border-1" : ""
                }`}
                onClick={() => {localStorage.removeItem('school'); localStorage.removeItem('course'); navigateTo("/teacher")}}
              >
                <img src={FreeCode} alt="Codeo Libre" className="h-6" />
                <span className="font-semibold ml-2">Instrucciones</span>
              </button>
            )}
          </div>

          <div className="flex justify-end items-center gap-2 w-24">
            <img src={Settings} alt="Ajustes" className="h-6" />
            <img src={Bell} alt="Notificaciones" className="h-6" />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
