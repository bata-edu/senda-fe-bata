export const API_BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';
export const LOGIN_ENDPOINT = `${API_BASE_URL}/v1/auth/login`;
export const LOGOUT_ENDPOINT = `${API_BASE_URL}/v1/auth/logout`;
export const REGISTER_ENDPOINT = `${API_BASE_URL}/v1/auth/register`;
export const REFRESH_TOKEN_ENDPOINT = `${API_BASE_URL}/v1/auth/refresh-tokens`;
