import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, refreshAccessToken } from '../../features/auth/authService';
import dayjs from 'dayjs';

const LoginGuard = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const { accessToken, accessExpires, refreshExpires } = getAuthData();
    const now = dayjs();

    if (accessToken && dayjs(accessExpires).isAfter(now)) {
      navigate('/home');
    } 
    else if (dayjs(refreshExpires).isAfter(now)) {
      refreshAccessToken()
        .then(() => {
          navigate('/home');
        })
        .catch(() => {
          // Manejar error si falla el refresco del token
        });
    }
  }, [navigate]);

  return children;
};

export default LoginGuard;
