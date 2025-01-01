import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthData } from "../../features/auth/authService";
import {  USER_STUDENT, USER_TEACHER } from "../constants";
import useCheckUserRole from "../checkUserRole";

const TeacherAndStudentGuard = ({ children }) => {
    const navigate = useNavigate();
    const checkUserRole = useCheckUserRole([USER_STUDENT, USER_TEACHER]);
    const { user } = getAuthData();
    useEffect(() => {
        const checkUser = async () => {
            await checkUserRole(user);
        }
        checkUser();
    }, [navigate]);
    
    return children;
};

export default TeacherAndStudentGuard;
