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
import RootRedirect from "../utils/guards/rootRedirect";
import SectionPage from "../pages/student/SectionPage";
import Profile from "../pages/student/ProfilePage";
import AdminHomePage from "../pages/admin/AdminHomePage";
import SchoolAdminHomePage from "../pages/school-admin/SchoolAdminHomePage";
import TeacherHomePage from "../pages/teacher/TeacherHomePage";
import StudentGuard from "../utils/guards/studentGuard";
import AdminGuard from "../utils/guards/adminGuard";
import AdminSchoolGuard from "../utils/guards/adminSchoolGuard";
import TeacherGuard from "../utils/guards/teacherGuard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
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
          path="/home"
          element={
            <AuthGuard>
              <StudentGuard>
                <Home />
              </StudentGuard>
            </AuthGuard>
          }
        >
          <Route index element={<MainContent />} />
          <Route path="levels" element={<Levels />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/section/:id"
          element={
            <AuthGuard>
              <StudentGuard>
                <SectionPage />
              </StudentGuard>
            </AuthGuard>
          }
        ></Route>

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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
