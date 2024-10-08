import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Home from '../pages/HomePage';
import LoginGuard from '../utils/guards/loginGuard'
import AuthGuard from '../utils/guards/authGuard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
      <Route 
          path="/login" 
          element={
            <LoginGuard>
              <LoginPage/>
            </LoginGuard>
          }
        />
        <Route 
            path="/home"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            } 
          />
        <Route 
          path="/register"
          element={
            <LoginGuard>
              <RegisterPage/>
            </LoginGuard>
          }
          />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
