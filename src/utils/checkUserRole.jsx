import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authService";
import { useDispatch } from "react-redux";
import { RESET_STATE } from "./constants";

const useCheckUserRole = (roles) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const checkRole = async (user) => {
        if (!roles.includes(user?.role)) {
            await logoutUser();
            dispatch({ type: RESET_STATE });
            navigate("/login");
        }
    };

    return checkRole;
}

export default useCheckUserRole;