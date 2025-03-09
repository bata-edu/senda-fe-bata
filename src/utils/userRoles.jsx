import { useNavigate } from "react-router-dom";
import {
  USER_ADMIN,
  USER_STUDENT,
  USER_TEACHER,
  USER_SCHOOL_ADMIN,
} from "./constants";

const useNavigateToDashboard = () => {
  const navigate = useNavigate();

  const navigateToDashboard = (role) => {
    switch (role) {
      case USER_ADMIN:
        navigate("/admin");
        break;
      case USER_STUDENT:
        navigate("/learn/modules");
        break;
      case USER_TEACHER:
        navigate("/teacher");
        break;
      case USER_SCHOOL_ADMIN:
        navigate("/school-admin");
        break;
      default:
        navigate("/")
        break;
    }
  };

  return navigateToDashboard;
};

export default useNavigateToDashboard;
