import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAuthData, refreshAccessToken, logoutUser } from '../../features/auth/authService';
import LoadingPage from '../../pages/LoadingPage';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { accessToken, refreshToken, accessExpires, refreshExpires } = getAuthData();
      const now = dayjs();

      if (accessToken && dayjs(accessExpires).isAfter(now)) {
        setLoading(false);
        return;
      } 

      if (!accessToken || dayjs(accessExpires).isBefore(now)) {
        if (refreshToken && dayjs(refreshExpires).isAfter(now)) {
          try {
            await refreshAccessToken();
            setLoading(false);
            return; 
          } catch (error) {
            setLoading(false);
            logoutUser();
            navigate('/login');
            return;
          }
        } else {
          setLoading(false);
          logoutUser();
          navigate('/login');
        }
      }
    };

    checkAuth(); 

  }, [navigate]);

  if (loading) {
    return <LoadingPage />;
  }

  return children;
};

export default AuthGuard;
