import AOS from "aos";
import "aos/dist/aos.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Home from "../pages/student/HomePage";
import LoginGuard from "../utils/guards/loginGuard";
import AuthGuard from "../utils/guards/authGuard";
import MainContent from "../components/home/MainContent";
import Levels from "../components/home/Levels";
import EditorPage from "../pages/student/EditorPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import LandingPage from "../pages/landing/LandingPage";
import ProgressPage from "../pages/student/ProgressPage";
import Profile from "../pages/student/ProfilePage";
import AdminHomePage from "../pages/admin/AdminHomePage";
import SchoolAdminHomePage from "../pages/school-admin/SchoolAdminHomePage";
import TeacherHomePage from "../pages/teacher/TeacherHomePage";
import StudentGuard from "../utils/guards/studentGuard";
import AdminGuard from "../utils/guards/adminGuard";
import AdminSchoolGuard from "../utils/guards/adminSchoolGuard";
import TeacherGuard from "../utils/guards/teacherGuard";
import TeacherNewSchool from "../pages/teacher/TeacherNewSchool";
import CoursesPage from "../pages/courses/CoursesPage";
import CreateCourseForm from "../components/courses/CourseForm";
import CourseDashboard from "../components/courses/CourseDetail";
import ExamForm from "../components/exam/ExamForm";
import ExamList from "../components/exam/ExamList";
import CombineGuard from "../utils/guards/combineGuard";
import Teachers from "../components/teachers/Teachers";
import { useEffect } from "react";
import ClassRoom from "../components/classRoom/classRoom";
import Modules from "../components/home/CourseSelector";
import Sections from "../components/home/Sections";

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
              <StudentGuard>
                <Home />
              </StudentGuard>
            </AuthGuard>
          }
        >
          <Route path="levels" element={<MainContent />} />
          <Route path="modules" element={<Modules />} />
          <Route path="sections" element={<Sections />} />
          <Route path="levels" element={<Levels />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/progress"
          element={
            <AuthGuard>
              <StudentGuard>
                <ProgressPage />
              </StudentGuard>
            </AuthGuard>
          }
        ></Route>
        <Route
          path="/classroom"
          element={
            <AuthGuard>
              <StudentGuard>
                <ClassRoom /> {/* Crear componente page */}
              </StudentGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminGuard>
                <AdminHomePage />
              </AdminGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/school-admin"
          element={
            <AuthGuard>
              <AdminSchoolGuard>
                <SchoolAdminHomePage />
              </AdminSchoolGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/teacher"
          element={
            <AuthGuard>
              <TeacherGuard>
                <TeacherHomePage />
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/teacher/new-school"
          element={
            <AuthGuard>
              <TeacherGuard>
                <TeacherNewSchool />
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/courses/:schoolId"
          element={
            <AuthGuard>
              <CombineGuard>
                <CoursesPage />
              </CombineGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/courses/:schoolId/new"
          element={
            <AuthGuard>
              <TeacherGuard>
                <CreateCourseForm />
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/teacher/course/:courseId"
          element={
            <AuthGuard>
              <CombineGuard>
                <CourseDashboard />
              </CombineGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/exam/create/:courseId"
          element={
            <AuthGuard>
              <TeacherGuard>
                <ExamForm />
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/exam/list/:courseId"
          element={
            <AuthGuard>
              <TeacherGuard>
                <ExamList />
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/professors/:schoolId"
          element={
            <AuthGuard>
              <AdminSchoolGuard>
                <Teachers />
              </AdminSchoolGuard>
            </AuthGuard>
          }
        />
        <Route 
          path="/exam-form/:courseId"
          element={
            <AuthGuard>
              <TeacherGuard>
                <ExamForm />
              </TeacherGuard>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
