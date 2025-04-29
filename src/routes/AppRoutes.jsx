import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Home from "../pages/student/HomePage";

import { ModuleList } from "../components/home/ModuleList";
import { LevelList } from "../components/home/module/LevelList";
import { SectionList } from "../components/home/module/level/SectionList";
import { SectionPage } from "../components/home/module/level/section/SectionPage";

import EditorPage from "../pages/student/EditorPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import LandingPage from "../pages/landing/LandingPage";
import Profile from "../pages/student/ProfilePage";

import FreeCodeList from "../pages/student/FreeCodeList";
import TeacherAndStudentGuard from "../utils/guards/teacherAndStudentGuard";

const AppRoutes = () => {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
        <Route path="/learn" element={<Home />}>
          <Route index element={<Navigate to="modules" replace />} />
          <Route path="modules" element={<ModuleList />} />
          <Route path="modules/:moduleSlug" element={<LevelList />} />
          <Route path="modules/:moduleSlug/levels/:levelId" element={<SectionList />} />
          <Route path="modules/:moduleSlug/levels/:levelId/sections/:sectionId" element={<SectionPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        </Route>

        <Route path="/editor" element={<FreeCodeList />}/>
        <Route path="editor/:id" element={<EditorPage />}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
