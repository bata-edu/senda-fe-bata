export const API_BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';
export const LOGIN_ENDPOINT = `${API_BASE_URL}/v1/auth/login`;
export const LOGOUT_ENDPOINT = `${API_BASE_URL}/v1/auth/logout`;
export const REGISTER_ENDPOINT = `${API_BASE_URL}/v1/auth/register`;
export const REFRESH_TOKEN_ENDPOINT = `${API_BASE_URL}/v1/auth/refresh-tokens`;

export const USER_PROGRESS_ENDPOINT = `${API_BASE_URL}/v1/userCourseProgress`;
export const START_COURSE_ENDPOINT = `${USER_PROGRESS_ENDPOINT}/start`;

export const LEVEL_ENDPOINT = `${API_BASE_URL}/v1/level`;
export const LEVEL_INFO_ENDPOINT = `${LEVEL_ENDPOINT}/info`;
export const ALL_LEVELS_ENDPOINT = `${LEVEL_ENDPOINT}/module`;

export const USER_ENDPOINT = `${API_BASE_URL}/v1/user`;


