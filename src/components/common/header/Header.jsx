import React from "react";
import { useLocation } from "react-router-dom";
import logoImage from "../../../assets/logo.svg";
import Clasroom from "../../../assets/icons/aula.svg";
import FreeCode from "../../../assets/icons/codeo-libre.svg";
import Courses from "../../../assets/icons/cursos.svg";
import Settings from "../../../assets/icons/settings.svg";
import Bell from "../../../assets/icons/bell.svg";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-white shadow-sm border-b border-borderGray flex items-center p-4">
      <div className="flex items-center w-24">
        <img src={logoImage} alt="Logo Bata" className="h-8" />
      </div>

      <div className="flex justify-center items-center mx-auto">
        <button
          className={`flex items-center mx-1 p-2 rounded ${
            isActive("/modules") ? "bg-grayBg border-borderGray border-1" : ""
          }`}
        >
          <img src={Courses} alt="Cursos" className="h-6" />
          <span className="font-semibold ml-2">Cursos</span>
        </button>
        <button
          className={`flex items-center mx-1 p-2 rounded ${
            isActive("/aula") ? "bg-grayBg border-borderGray border-1" : ""
          }`}
        >
          <img src={Clasroom} alt="Aula" className="h-6" />
          <span className="font-semibold ml-2">Aula</span>
        </button>
        <button
          className={`flex items-center mx-1 p-2 rounded ${
            isActive("/codeo-libre")
              ? "bg-grayBg border-borderGray border-1"
              : ""
          }`}
        >
          <img src={FreeCode} alt="Codeo Libre" className="h-6" />
          <span className="font-semibold ml-2">Codeo Libre</span>
        </button>
      </div>

      <div className="flex justify-end items-center gap-2 w-24">
        <img src={Settings} alt="Ajustes" className="h-6" />
        <img src={Bell} alt="Notificaciones" className="h-6" />
      </div>
    </header>
  );
};

export default Header;
