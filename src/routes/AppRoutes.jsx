import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Home from "../pages/student/HomePage";
import LoginGuard from "../utils/guards/loginGuard";
import AuthGuard from "../utils/guards/authGuard";

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

        <Route
          path="/login"
          element={
            <LoginGuard>
              <LoginPage />
            </LoginGuard>
          }
        />
        <Route
          path="/register"
          element={
            <LoginGuard>
              <RegisterPage />
            </LoginGuard>
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/learn"
          element={
            <AuthGuard>
              <TeacherAndStudentGuard>
                <Home />
              </TeacherAndStudentGuard>
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="modules" replace />} />
          <Route path="modules" element={<ModuleList />} />
          <Route path="modules/:moduleId" element={<LevelList />} />
          <Route path="modules/:moduleId/levels/:levelId" element={<SectionList />} />
          <Route path="modules/:moduleId/levels/:levelId/sections/:sectionId" element={<SectionPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/editor"
          element={
            <AuthGuard>
              <TeacherAndStudentGuard>
                <FreeCodeList />
              </TeacherAndStudentGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <AuthGuard>
              <TeacherAndStudentGuard>
                <EditorPage />
              </TeacherAndStudentGuard>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
