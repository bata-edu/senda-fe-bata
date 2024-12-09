import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getIntoCourse } from "../../features/school/schoolSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import left from "../../assets/icons/corchete-izquierdo.svg";
import right from "../../assets/icons/corchete-derecho.svg";
import lifeIcon from "../../assets/icons/heart.svg";
import streakIcon from "../../assets/icons/fire.svg";
import pointsIcon from "../../assets/icons/points.svg";
import arrowLeftIcon from "../../assets/icons/arrowLeft.svg";
import { getUser } from "../../features/auth/authService";

const ClassRoom = () => {
  const dispatch = useDispatch();
  const [classroomCode, setClassroomCode] = useState("");
  const user = getUser();

  const handleJoinClassroom = async () => {
    try {
      await dispatch(getIntoCourse({ courseCode: classroomCode })).unwrap();
      setClassroomCode("");
      toast.success("Te has unido exitosamente", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error al unirse al aula:", error);
      toast.error("Error al unirse al aula. Intenta nuevamente.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-grayBg px-4">
      <div className="absolute top-6 right-6 flex items-center space-x-8 text-gray-700">
        <div className="flex items-center space-x-2">
          <img src={pointsIcon} alt="Puntos" className="h-6 w-6" />
          <span className="text-xl font-bold">{user.points}</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src={lifeIcon} alt="Vidas" className="h-6 w-6" />
          <span className="text-xl font-bold">{user.life}</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src={streakIcon} alt="Racha" className="h-6 w-6" />
          <span className="text-xl font-bold">{user.streak}</span>
        </div>
      </div>

      <h1 className="text-6xl font-bold text-gray-800 flex items-center space-x-2">
        <img src={left} alt="Corchete izquierdo" className="h-10" />
        <span>Conéctate a tu aula</span>
        <img src={right} alt="Corchete derecho" className="h-10" />
      </h1>

      <div className="flex items-center space-x-4 mt-8">
        <input
          type="text"
          placeholder="Código de aula"
          value={classroomCode}
          onChange={(e) => setClassroomCode(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-gray-500 focus:outline-none"
        />
        <button
          onClick={handleJoinClassroom}
          className="flex items-center space-x-2 px-6 py-2 bg-gray-300 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <img src={arrowLeftIcon} />
          <span className="text-black">Unirme</span>
        </button>
      </div>
    </div>
  );
};

export default ClassRoom;
