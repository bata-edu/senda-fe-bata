import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../../assets/logo.svg";
import Clasroom from "../../../assets/icons/aula.svg";
import FreeCode from "../../../assets/icons/codeo-libre.svg";
import Courses from "../../../assets/icons/cursos.svg";
import Settings from "../../../assets/icons/settings.svg";
import Bell from "../../../assets/icons/bell.svg";

import whiteLogoImage from "../../../assets/logo-white.svg"
import whiteClasroom from "../../../assets/icons/white/aula.svg";
import whiteFreeCode from "../../../assets/icons/white/codeo-libre.svg";
import whiteCourses from "../../../assets/icons/white/cursos.svg";
import whiteSettings from "../../../assets/icons/white/settings.svg";
import whiteBell from "../../../assets/icons/white/bell.svg";
import profileSkeleton from "../../../assets/icons/profile-skel.svg"
import profileSkeletonWhite from "../../../assets/icons/white/profile-skel-white.svg"


import { logout } from "../../../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
const Header = ({className}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const isActive = (path) => location.pathname.startsWith(path);
  const isEditor = isActive("/editor")

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  let activeButtonClassName = "bg-headerButtonActive border-borderHeaderButtonActive border-1.5"
  if (isEditor) {
    activeButtonClassName = "bg-[#2F414A] border-[#385966] border-1"
  }

  return (
    <header className={`w-full ${isEditor ? "bg-darkHeader border-[#535D67] text-lightGray" : "bg-white border-borderGray"} shadow-sm border-b  flex items-center p-4 h-[10vh]`}>
      <div className="flex items-center w-24">
        <img src={isEditor ? whiteLogoImage : logoImage} alt="Logo Bata" className="h-8" />
      </div>
      {user && (
        <>
          <div className="flex gap-0 sm:gap-2 justify-center items-center mx-auto">
            <button
              className={`flex items-center p-2 rounded border-[1.5px] ${
                isActive("/learn/modules")
                  ? activeButtonClassName
                  : "border-transparent"
              }`}
              onClick={() => navigateTo("/learn/modules")}
            >
              <img src={isEditor ? whiteCourses : Courses} alt="Cursos" className="h-6" />
              <span className="font-semibold ml-2 hidden sm:block">Cursos</span>
            </button>
            {user.role === "student" && (
              <button
                className={`pointer-events-none opacity-50 flex items-center p-2 rounded ${
                  isActive("/classroom")
                    ? activeButtonClassName
                    : ""
                }`}
                onClick={() => navigateTo("/classroom")}
              >
                <img src={isEditor ? whiteClasroom : Clasroom} alt="Aula" className="h-6" />
                <span className="font-semibold ml-2  hidden sm:block">Aula</span>
              </button>
            )}
            <button
              className={`flex items-center p-2 rounded ${
                isEditor
                  ? activeButtonClassName
                  : ""
              }`}
              onClick={() => navigateTo("/editor")}
            >
              <img src={isEditor ? whiteFreeCode : FreeCode} alt="Codeo Libre" className="h-6" />
              <span className="font-semibold ml-2 hidden sm:block">Codeo Libre</span>
            </button>
            {user.role === "teacher" && (
              <button
                className={`flex items-center p-2 rounded ${
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
                <img src={isEditor ? whiteFreeCode : FreeCode} alt="Codeo Libre" className="h-6" />
                <span className="font-semibold ml-2 hidden sm:block">Instrucciones</span>
              </button>
            )}
          </div>

          <div className="flex justify-end items-center gap-2 sm:gap-4">
            <img
              src={isEditor ? whiteSettings : Settings}
              alt="Ajustes"
              className="h-5 cursor-pointer"
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
            <img src={isEditor ? whiteBell : Bell} alt="Notificaciones" className="h-5" />
            <img  onClick={() => navigate("/learn/profile")} src={isEditor ? profileSkeletonWhite : profileSkeleton} alt="Notificaciones" className={`size-10 ${isEditor ? "fill-white" : ""}`} />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
