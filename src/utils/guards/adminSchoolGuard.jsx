import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthData, logoutUser } from "../../features/auth/authService";
import { USER_SCHOOL_ADMIN } from "../constants";
import useCheckUserRole from "../checkUserRole";

const AdminSchoolGuard = ({ children }) => {
    const navigate = useNavigate();
    const checkUserRole = useCheckUserRole(USER_SCHOOL_ADMIN);
    const { user } = getAuthData();
    useEffect(() => {
        const checkUser = async () => {
            await checkUserRole(user);
        }
        checkUser();
    }, [navigate]);
    
    return children;
};

export default AdminSchoolGuard;
