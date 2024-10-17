import dayjs from 'dayjs';
import { getAuthData, refreshAccessToken } from '../features/auth/authService';

export const isAuthenticated = async () => {
  const { accessToken, refreshToken, accessExpires, refreshExpires } = getAuthData();
  const now = dayjs();

  if (accessToken && dayjs(accessExpires).isAfter(now)) {
    return true;
  }

  if (refreshToken && dayjs(refreshExpires).isAfter(now)) {
    try {
      await refreshAccessToken();
      return true;
    } catch (error) {
      return false;
    }
  }

  return false;
};
