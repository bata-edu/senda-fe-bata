import axios from 'axios';
import { LOGIN_ENDPOINT,REGISTER_ENDPOINT, LOGOUT_ENDPOINT, REFRESH_TOKEN_ENDPOINT } from '../../utils/constants';

// Guardar los tokens y la información del usuario en localStorage
const setAuthData = ({ tokens, user }) => {
  localStorage.setItem('accessToken', tokens.access.token);
  localStorage.setItem('refreshToken', tokens.refresh.token);
  localStorage.setItem('accessExpires', tokens.access.expires);
  localStorage.setItem('refreshExpires', tokens.refresh.expires);
  localStorage.setItem('user', JSON.stringify(user));
};

// Limpiar el almacenamiento de localStorage
const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessExpires');
  localStorage.removeItem('refreshExpires');
  localStorage.removeItem('user');
};

// Obtener los tokens desde localStorage
const getAuthData = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const accessExpires = localStorage.getItem('accessExpires');
  const refreshExpires = localStorage.getItem('refreshExpires');
  const user = JSON.parse(localStorage.getItem('user'));
  
  return { accessToken, refreshToken, accessExpires, refreshExpires, user };
};

// Obtener información del usuario
const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Hacer login y almacenar los datos
const loginUser = async (email, password) => {
  const response = await axios.post(LOGIN_ENDPOINT, { email, password });
  setAuthData(response.data);
  return response.data;
};

// Hacer register y almacenar los datos
const registerUser = async (name, lastName, email, password) => {
  const response = await axios.post(REGISTER_ENDPOINT, { name, lastName, email, password });
  setAuthData(response.data); // Guardamos los tokens y el usuario en localStorage
  return response.data;
};

// Hacer logout y limpiar localStorage
const logoutUser = async () => {
  const { refreshToken } = getAuthData();
  if (refreshToken) {
    await axios.post(LOGOUT_ENDPOINT, { refreshToken });
    clearAuthData();
  }
};

// Refrescar el token de acceso
const refreshAccessToken = async () => {
  const { refreshToken } = getAuthData();
  if (refreshToken) {
    const response = await axios.post(REFRESH_TOKEN_ENDPOINT, { refreshToken });
    setAuthData(response.data);
    return response.data.tokens.access.token;
  }
  return null;
};

export {
  loginUser,
  logoutUser,
  refreshAccessToken,
  getAuthData,
  clearAuthData,
  registerUser,
  getUser
};
