export const API_BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';

export const AUTH_ENDPOINT = `${API_BASE_URL}/v1/auth`; 
export const LOGIN_ENDPOINT = `${AUTH_ENDPOINT}/login`;
export const LOGOUT_ENDPOINT = `${AUTH_ENDPOINT}/logout`;
export const REGISTER_ENDPOINT = `${AUTH_ENDPOINT}/register`;
export const REFRESH_TOKEN_ENDPOINT = `${AUTH_ENDPOINT}/refresh-tokens`;
export const FORGOT_PASSWORD_ENDPOINT = `${AUTH_ENDPOINT}/forgot-password`;
export const RESET_PASSWORD_ENDPOINT = `${AUTH_ENDPOINT}/reset-password`;
export const VERIFY_EMAIL_ENDPOINT = `${AUTH_ENDPOINT}/verify-email`;

export const USER_PROGRESS_ENDPOINT = `${API_BASE_URL}/v1/userCourseProgress`;
export const START_COURSE_ENDPOINT = `${USER_PROGRESS_ENDPOINT}/start`;

export const LEVEL_ENDPOINT = `${API_BASE_URL}/v1/level`;
export const LEVEL_INFO_ENDPOINT = `${LEVEL_ENDPOINT}/info`;
export const ALL_LEVELS_ENDPOINT = `${LEVEL_ENDPOINT}/module`;

export const USER_ENDPOINT = `${API_BASE_URL}/v1/user`;


