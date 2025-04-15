export const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL ?? "http://localhost:4000";
export const RESET_STATE = "RESET_STATE";

export const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;
export const LOGIN_ENDPOINT = `${AUTH_ENDPOINT}/login`;
export const LOGOUT_ENDPOINT = `${AUTH_ENDPOINT}/logout`;
export const REGISTER_ENDPOINT = `${AUTH_ENDPOINT}/register`;
export const REFRESH_TOKEN_ENDPOINT = `${AUTH_ENDPOINT}/refresh-tokens`;
export const FORGOT_PASSWORD_ENDPOINT = `${AUTH_ENDPOINT}/forgot-password`;
export const RESET_PASSWORD_ENDPOINT = `${AUTH_ENDPOINT}/reset-password`;
export const VERIFY_EMAIL_ENDPOINT = `${AUTH_ENDPOINT}/verify-email`;
export const GOOGLE_LOGIN_ENDPOINT = `${AUTH_ENDPOINT}/google-login`;
export const GOOGLE_REGISTER_ENDPOINT = `${AUTH_ENDPOINT}/google-register`;

export const USER_PROGRESS_ENDPOINT = `${API_BASE_URL}/userCourseProgress`;
export const START_COURSE_ENDPOINT = `${USER_PROGRESS_ENDPOINT}/start`;
export const MY_NEXT_ACTION = `${USER_PROGRESS_ENDPOINT}/next-action`;
export const MY_NEXT_CLASS = `${USER_PROGRESS_ENDPOINT}/next-class`;
export const COMPLETE_CLASS_ENDPOINT = `${USER_PROGRESS_ENDPOINT}/complete-class`;
export const MY_NEXT_EXERCISE = `${USER_PROGRESS_ENDPOINT}/next-exercise`;
export const COMPLETE_EXERCISE_ENDPOINT = `${USER_PROGRESS_ENDPOINT}/complete-exercise`;
export const ADVANCE_COURSE = `${USER_PROGRESS_ENDPOINT}/advance`;
export const SKIP_CLASS = `${USER_PROGRESS_ENDPOINT}/skip-class`;
export const SUBMIT_FINAL_LEVEL = `${USER_PROGRESS_ENDPOINT}/submit-final-level`;

export const NEXT_CLASS = "Proceed to the next class";
export const NEXT_EXERCISE = "Proceed to the next exercise";
export const ADVANCE_SECTION = "Advance to the next section";
export const SUBMIT_FINAL_LEVEL_PROJECT = "Complete the final level project";
export const ADVANCE_LEVEL = "Advance to the next level";
export const COURSE_COMPLETED = "Course completed";

export const LEVEL_ENDPOINT = `${API_BASE_URL}/levels`;
export const LEVEL_INFO_ENDPOINT = `${LEVEL_ENDPOINT}`;
export const ALL_LEVELS_ENDPOINT = `${LEVEL_ENDPOINT}/module`;
export const FINAL_LEVEL_INFO = `${LEVEL_ENDPOINT}/finalProject`;

export const MODULE_ENDPOINT = `${API_BASE_URL}/module`;

export const USER_ENDPOINT = `${API_BASE_URL}/user`;
export const USER_DETAIL = `${USER_ENDPOINT}/detail`;
export const USER_FREE_MODE = `${USER_ENDPOINT}/freeModeProgress`;
export const RANK = `${USER_ENDPOINT}/rank-list`;

export const USER_STUDENT = 'student';
export const USER_TEACHER = 'teacher';
export const USER_ADMIN = 'admin';
export const USER_SCHOOL_ADMIN = 'schoolAdmin';

export const SECTION_ENDPOINT = `${API_BASE_URL}/section`;
export const SECTION_INDIVIDUAL = `${SECTION_ENDPOINT}/individual`;

export const SCHOOL_TEACHER_ENDPOINT = `${API_BASE_URL}/schoolTeacher`;
export const SCHOOL_TEACHER_INTOSCHOOL = `${SCHOOL_TEACHER_ENDPOINT}/get-into-school`;

export const SCHOOL_ENDPOINT = `${API_BASE_URL}/school`;

export const COURSE_ENDPOINT = `${API_BASE_URL}/course`;
export const GET_INTO_COURSE = `${COURSE_ENDPOINT}/getIntoCourse`;
export const GET_STUDENTS_IN_COURSE = `${COURSE_ENDPOINT}/getStudents`;
export const GET_STUDENTS_PROGRESS = `${COURSE_ENDPOINT}/getStudentsProgress`;
export const GET_COURSE_AND_SCHOOL = `${COURSE_ENDPOINT}/getCourseAndSchool`;

export const EXAM_ENDPOINT = `${API_BASE_URL}/exam`;
export const EXAM_SUBMIT = `${EXAM_ENDPOINT}/submit`;
export const EXAM_SUBMISSIONS = `${EXAM_ENDPOINT}/submissions`;
export const EXAM_SUBMISSIONS_BY_EXAM = `${EXAM_SUBMISSIONS}ByExam`;
export const EXAM_BY_COURSE = `${EXAM_ENDPOINT}/byCourse`;
export const GET_LAST = `${EXAM_ENDPOINT}/getLast`;
export const GET_COURSE_EXAMS = `${EXAM_ENDPOINT}/studentsExamSubmissions`;
export const GET_MY_TASK_PROGRESS = `${EXAM_ENDPOINT}/getTaskProgressByStudent`;
export const GET_MY_GRADE = `${EXAM_ENDPOINT}/getExamSubmissionByStudent`;

export const SUBMIT_EXAM = `${EXAM_ENDPOINT}/submit`;

export const COURSE_ARTICLE_ENDPOINT = `${API_BASE_URL}/courseArticle`;
export const COURSE_ARTICLE_DETAIL = `${COURSE_ARTICLE_ENDPOINT}/detail`;

export const ADMIN_ENDPOINT = `${API_BASE_URL}/admin`;