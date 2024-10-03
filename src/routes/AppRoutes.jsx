import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Home from '../pages/HomePage';
import AuthGuard from '../utils/guards/authGuard'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
      <Route 
          path="/login" 
          element={
            <AuthGuard>
              <LoginPage/>
            </AuthGuard>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
