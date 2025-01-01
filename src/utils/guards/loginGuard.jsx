import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuthData,
  refreshAccessToken,
} from "../../features/auth/authService";
import dayjs from "dayjs";
import useNavigateToDashboard from "../userRoles";

const LoginGuard = ({ children }) => {
  const navigate = useNavigate();
  const navigateToDashboard = useNavigateToDashboard();

  useEffect(() => {
    const { accessToken, accessExpires, refreshExpires, user } = getAuthData();
    const now = dayjs();

    if (accessToken && dayjs(accessExpires).isAfter(now)) {
      navigateToDashboard(user.role);
    } else if (dayjs(refreshExpires).isAfter(now)) {
      refreshAccessToken()
        .then(() => {
          navigateToDashboard(user.role);
        })
        .catch(() => {
          // Manejar error si falla el refresco del token
        });
    }
  }, [navigate]);

  return children;
};

export default LoginGuard;
