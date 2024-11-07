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
              <TeacherGuard>
                <CoursesPage/>
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route
          path= "/courses/:schoolId/new"
          element={
            <AuthGuard>
              <TeacherGuard>
                <CreateCourseForm/>
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/teacher/course/:courseId"
          element={
            <AuthGuard>
              <TeacherGuard>
                <CourseDashboard />
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route 
          path= "/exam/create/:courseId"
          element={
            <AuthGuard>
              <TeacherGuard>
                <ExamForm />
              </TeacherGuard>
            </AuthGuard>
          }
        />
        <Route
          path= "/exam/list/:courseId"
          element={
            <AuthGuard>
              <TeacherGuard>
                <ExamList />
              </TeacherGuard>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
