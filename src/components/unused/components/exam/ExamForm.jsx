import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createExam } from "../../features/exam/examSlice";
import { getUser } from "../../features/auth/authService";
import graduationIcon from "../../assets/icons/graduation.svg";
import { useLocation } from "react-router-dom";
import FileInput from "../common/input/fileInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePickerInput from "../common/input/dateInput";
import Header from "../common/header/Header";
import {
  getCourseLocalStorage,
  getSchoolLocalStorage,
} from "../../features/school/schoolSlice";
import Sidebar from "../home/SideBar";
import { TextInput } from "../common/input/Input";

const ExamForm = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [examData, setExamData] = useState({
    name: "",
    description: "",
    endDate: "",
    isFreeCode: false,
    questionText: "",
  });
  const [loading, setLoading] = useState(false);
  const schoolInfo = getSchoolLocalStorage();
  const courseInfo = getCourseLocalStorage();

  const [file, setFile] = useState(null);
  const [isAttachFile, setIsAttachFile] = useState(true);
  const examTypes = [
    {
      value: "EXAM",
      label: "Examen",
    },
    {
      value: "ASSIGNMENT",
      label: "Trabajo Práctico",
    },
  ];
  const [examTypeIndex, setExamTypeIndex] = useState(0);

  const handleChangeExamType = () => {
    const index = examTypeIndex + 1 >= examTypes.length ? 0 : examTypeIndex + 1;
    setExamTypeIndex(index);
  };

  const submitExam = async () => {
    try {
      const body = {
        name: examData.name,
        description: examData.description,
        schoolCourse: courseId,
        type: examTypes[examTypeIndex].value,
        teacher_id: getUser().id,
        code: examData.isFreeCode,
        endDate: examData.endDate,
      };
      if (!isAttachFile) {
        body.question = examData.questionText;
        setFile(null);
      }
      await dispatch(createExam({ exam: body, file }));
      toast.success("Examen creado correctamente");
    } catch (error) {
      console.error("Error al crear el examen:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="home-container">
        <Sidebar />
        <div className="bg-gray-50 w-full min-h-screen">
          <div className="flex flex-col justify-center md:flex-row gap-20 p-6">
            <div className="w-1/4">
              <div className="animate-bounce-in-down bg-[#F2F4FC] text-[#4558C8] border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <img
                      src={schoolInfo.logo}
                      alt="Logo Instituto"
                      className="h-10 w-10 rounded-full"
                    />
                    <span className="text-base font-medium">
                      {schoolInfo.name}
                    </span>
                  </div>
                  <img
                    src={graduationIcon}
                    alt="Icono Graduación"
                    className="h-6 w-6 rounded-full items-end"
                  />
                </div>
                <h2 className="text-2xl font-bold mt-2">{courseInfo.name}</h2>
              </div>
            </div>
            <div className="w-1/6">
              <div className="animate-bounce-in-down bg-white border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md">
                <div className="grid items-center">
                  <h3 className="text-xl font-bold border-b border-gray-200 pb-3">
                    {examTypes[examTypeIndex].label}
                  </h3>
                  <span
                    onClick={handleChangeExamType}
                    className="text-[#4558C8] font-bold text-sm text-center mb-2 mt-2 cursor-pointer"
                  >
                    Cambiar tipo de formulario
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center md:flex-row gap-20 p-6">
            <div className="w-1/2 bg-white p-6 rounded-lg">
              <div>
                <h3 className="text-xl font-bold">
                  Crear nuevo {examTypes[examTypeIndex].label}
                </h3>
              </div>
              <div className="mt-4 grid">
                <TextInput
                  type="text"
                  placeholder="Título"
                  value={examData.name}
                  onChange={(e) =>
                    setExamData({ ...examData, name: e.target.value })
                  }
                  className="w-full py-2 mb-4 font-semiBold text-xl rounded-lg focus:outline-none focus:none"
                />
                <TextInput
                  type="text"
                  placeholder="Descripción"
                  value={examData.description}
                  onChange={(e) =>
                    setExamData({ ...examData, description: e.target.value })
                  }
                  className="w-full mb-4 py-2 rounded-lg focus:outline-none focus:none"
                />
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-[#4558C8]"
                      checked={!isAttachFile}
                      onChange={() => setIsAttachFile(false)}
                    />
                    <span>Redactar consigna</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-[#4558C8]"
                      checked={isAttachFile}
                      onChange={() => setIsAttachFile(true)}
                    />
                    <span>Adjuntar archivo</span>
                  </label>
                </div>

                {isAttachFile ? (
                  <FileInput
                    file={file}
                    setFile={setFile}
                    name={"Subir o arrastrar la consigna"}
                    type={"HTML, CSS, JS o PY"}
                  />
                ) : (
                  <textarea
                    placeholder="Redacte la consigna aquí"
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={examData.questionText}
                    onChange={(e) =>
                      setExamData({ ...examData, questionText: e.target.value })
                    }
                  />
                )}

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="freeCodeAccess"
                    checked={examData.isFreeCode}
                    onChange={(e) =>
                      setExamData({ ...examData, isFreeCode: e.target.checked })
                    }
                    className="form-checkbox text-[#4558C8]"
                  />
                  <label
                    htmlFor="freeCodeAccess"
                    className="text-sm text-gray-600"
                  >
                    Activar acceso directo a Codeo Libre
                  </label>
                </div>
                <DatePickerInput
                  label="Fecha de entrega"
                  value={examData.endDate}
                  onChange={(value) =>
                    setExamData({ ...examData, endDate: value })
                  }
                  placeholder="Fecha de entrega"
                />
              </div>
              <div className="flex w-full">
                <button
                  className="text-white px-4 py-2 rounded-lg mt-4 w-full active: bg-[#4558C8] disabled:bg-gray-300 cursor-not-allowed"
                  disabled={
                    !examData.description ||
                    !examData.name ||
                    !examData.endDate ||
                    (!isAttachFile && !examData.questionText) ||
                    loading ||
                    (isAttachFile && !file)
                  }
                  onClick={submitExam}
                >
                  Crear asignación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamForm;
