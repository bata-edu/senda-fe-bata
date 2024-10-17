import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Home from "../pages/HomePage";
import LoginGuard from "../utils/guards/loginGuard";
import AuthGuard from "../utils/guards/authGuard";
import MainContent from "../components/home/MainContent";
import Levels from "../components/home/Levels";
import EditorPage from "../pages/EditorPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import Profile from "../pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
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
              <Home />
            </AuthGuard>
          }
        >
          <Route
            path="/home/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          ></Route>
          <Route index element={<MainContent />} />
          <Route path="levels" element={<Levels />} />
          <Route path="editor" element={<EditorPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
