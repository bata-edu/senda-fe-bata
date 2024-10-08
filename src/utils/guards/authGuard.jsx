import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAuthData, refreshAccessToken, logoutUser } from '../../features/auth/authService';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { accessToken, refreshToken, accessExpires, refreshExpires } = getAuthData();
      const now = dayjs();

      if (accessToken && dayjs(accessExpires).isAfter(now)) {
        return;
      } 

      if (!accessToken || dayjs(accessExpires).isBefore(now)) {
        if (refreshToken && dayjs(refreshExpires).isAfter(now)) {
          try {
            await refreshAccessToken();
            return; 
          } catch (error) {
            logoutUser();
            navigate('/login');
            return;
          }
        } else {
          logoutUser();
          navigate('/login');
        }
      }
    };

    checkAuth(); 

  }, [navigate]);

  return children;
};

export default AuthGuard;
