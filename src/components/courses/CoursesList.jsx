import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import left from "../../assets/icons/corchete-izquierdo.svg";
import right from "../../assets/icons/corchete-derecho.svg";
import rightArrow from "../../assets/icons/rightLeft.svg";
import graduationIcon from "../../assets/icons/graduation.svg";
import GenericDialog from "../common/dialog/dialog";
import { useDispatch } from "react-redux";
import {
  createCourse,
  getSchoolLocalStorage,
  saveCourseLocalStorage,
} from "../../features/school/schoolSlice";
import { placeholder } from "@codemirror/view";
import Header from "../common/header/Header";

const CoursesList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { schoolId } = useParams();
  const { courses } = useSelector((state) => state.school);
  let schoolInfo = getSchoolLocalStorage();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleNavigateToCourse = (course) => {
    saveCourseLocalStorage(course);
    navigate("/teacher/course/" + course.id);
  };

  const createNewCourse = async () => {
    const body = {
      school_id: schoolId,
      name,
      description,
      startDate,
      endDate,
    };
    await dispatch(createCourse(body));
    setShowDialog(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-grayBg">
      <Header />
      <div className="flex w-full items-center justify-center  relative mt-4">
        <div className="animate-bounce-in-down bg-[#F2F4FC] text-[#4558C8] border border-blue-200 rounded-lg px-6 py-3 flex items-center gap-4 shadow-md justify-between w-1/4">
          <div className="flex gap-2">
            <img
              src={schoolInfo.logo}
              alt="Logo Instituto"
              className="h-6 w-6 rounded-full"
            />
            <span className="text-base font-medium">{schoolInfo.name}</span>
          </div>
          <img
            src={graduationIcon}
            alt="Icono Graduación"
            className="h-6 w-6 rounded-full items-end"
          />
        </div>
      </div>
      <div className="flex mt-10 gap-4">
        <img src={left} alt="Corchete izquierdo" className="h-10 mt-2 mb-12" />
        <h1 className="text-5xl text-gray-800">Selecciona un aula</h1>
        <img src={right} alt="Corchete derecho" className="h-10 mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 w-4/5 max-w-5xl px-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="relative bg-[#EE5E37] text-white shadow-[0_8px_3px_rgba(183,32,23,1)] p-6 hover:shadow-[0_12px_3px_rgba(183,32,23,1)] transition-all cursor-pointer"
            style={{ borderRadius: "1.5rem" }}
            onClick={() => handleNavigateToCourse(course)}
          >
            <span className="text-4xl font-semibold block mb-10">
              {course.name}
            </span>
            <div className="flex justify-between">
              <span className="text-lg font-medium text-[#FEF3EE]">
                Codigo: {course.code}
              </span>
              <div className="bottom-4 right-4 bg-[#FEF3EE] rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg">
                <span className="font-medium text-3xl text-[#EE5E37]"> ➔</span>
              </div>
            </div>
          </div>
        ))}

        <div
          className="relative flex flex-col justify-between bg-[#FEF5F2] text-[#DD2E19] rounded-lg shadow-[0_8px_0px_0px_rgba(250,190,167,1)] p-6 hover:shadow-[0_12px_0px_0px_rgba(250,190,167,1)] transition-all cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          <div>
            <span className="text-4xl font-bold block mb-10">
              Crear nueva aula
            </span>
            <div className="flex justify-between">
              <span className="text-lg font-medium text-[#DD2E19]">
                Añade una nueva aula
              </span>
              <div className="bottom-3 right-3 bg-[#DD2E19] text-[#FEF5F2] rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                <span
                  className="font-medium text-3xl"
                  style={{ marginTop: "-5px" }}
                >
                  +
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDialog && (
        <GenericDialog
          type="form"
          title="Crear nueva aula"
          description={"Aqui podras crear una nueva aula para tus estudiantes"}
          inputs={[
            {
              placeholder: "Nombre del aula",
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
            },
            {
              placeholder: "Descripción",
              type: "text",
              value: description,
              onChange: (e) => setDescription(e.target.value),
            },
            {
              placeholder: "Fecha de inicio",
              type: "date",
              value: startDate,
              onChange: (e) => setStartDate(e.target.value),
            },
            {
              placeholder: "Fecha de fin",
              type: "date",
              value: endDate,
              onChange: (e) => setEndDate(e.target.value),
            },
          ]}
          cancelButtonText="Cancelar"
          onCancel={() => setShowDialog(false)}
          onConfirm={createNewCourse}
        />
      )}
    </div>
  );
};

export default CoursesList;
