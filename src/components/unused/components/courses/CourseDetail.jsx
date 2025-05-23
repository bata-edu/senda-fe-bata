import React, { useEffect, useState } from "react";
import pencil from "../../assets/pencil.svg";
import pencilB from "../../assets/pencilB.svg";
import graduationIcon from "../../assets/icons/graduation.svg";
import { getExamsByCourse, updateExam } from "../../../features/exam/examSlice";
import {
  getCourseArticles,
  createCourseArticle,
  editCourseArticle,
} from "../../../features/courseArticle/courseArticle";
import {
  getCourseLocalStorage,
  getSchoolLocalStorage,
  getStudentsProgress,
} from "../../../features/school/schoolSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingPage from "../../../pages/LoadingPage";
import { fetchModules } from "../../../features/module/moduleSlice";
import cycle from "../../assets/icons/cycle.svg";
import maleExample from "../../assets/male-example.svg";
import GenericDialog from "../../common/dialog/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../common/header/Header";
import Sidebar from "../../home/SideBar";
import { TextInput } from "../../common/input/Input";

const CourseDashboard = () => {
  const dispatch = useDispatch();
  const courseInfo = getCourseLocalStorage();
  const schoolInfo = getSchoolLocalStorage();
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { modules } = useSelector((state) => state.modules);
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [selectedModule, setSelectedModule] = useState();
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const { students_module } = useSelector((state) => state.school);
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [chips, setChips] = useState([]);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchCourseInfo(currentPage);
  }, []);

  const fetchCourseInfo = async (page) => {
    setLoading(true);
    const m = await dispatch(fetchModules());
    const moduleA = m.payload.results[selectedModuleIndex];
    setSelectedModule(moduleA);
    fetchExams(page);
    const progress = await dispatch(
      getStudentsProgress({ courseId: courseInfo.id, moduleId: moduleA.id })
    ).unwrap();
    setStudentsProgress([...progress]);
    setLoading(false);
  };

  const fetchExams = async (page) => {
    const query = {
      limit: 5,
      sortBy: "updatedAt:desc",
      page: page || 1,
    };

    const queryExams = {
      ...query,
      type: "!TASK"
    }

    const res = await Promise.all([
      dispatch(getExamsByCourse({ courseId: courseInfo.id, queryExams })),
      dispatch(getCourseArticles({ courseId: courseInfo.id, query })),
    ]);

    const exams = res[0].payload.results;
    const articles = res[1].payload.results;
    setTotalItems((res[0].payload.totalResults + res[1].payload.totalResults) / itemsPerPage);
    const data = [...exams, ...articles];
    data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setCourseData(data);
  }

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    fetchExams(nextPage);
};

  const changeModule = async () => {
    const index =
      selectedModuleIndex + 1 >= modules.length ? 0 : selectedModuleIndex + 1;
    await dispatch(
      getStudentsProgress({
        courseId: courseInfo.id,
        moduleId: modules[index].id,
      })
    );
    setSelectedModuleIndex(index);
  };

  useEffect(() => {
    if (loading) return;
    setSelectedModule(modules[selectedModuleIndex]);
    setStudentsProgress([...students_module]);
  }, [selectedModuleIndex]);

  const handleCreateArticle = async () => {
    try {
      const body = {
        name,
        description,
        content,
        labels: chips,
      };
      const res = await dispatch(
        createCourseArticle({
          courseId: courseInfo.id,
          article: body,
          file: file,
        })
      );
      toast.success("Artículo creado correctamente");
      setCourseData([...courseData, res.payload]);
      setShowDialog(false);
    } catch (error) {
      console.error("Error al crear el articulo:", error);
    }
  };

  const updateData = async () => {
    if (selectedData.content) {
      const body = {
        name: selectedData.name,
        description: selectedData.description,
        content: selectedData.content,
        labels: selectedData.labels,
      };
      const res = await dispatch(
        editCourseArticle({ articleId: selectedData.id, article: body })
      );
      toast.success("Artículo editado correctamente");
      setCourseData(
        courseData.map((data) =>
          data.id === res.payload.id ? res.payload : data
        )
      );
      setShowUpdateDialog(false);
    } else {
      const body = {
        name: selectedData.name,
        description: selectedData.description,
        endDate: selectedData.endDate,
      };
      const res = await dispatch(
        updateExam({ examId: selectedData.id, exam: body })
      );
      toast.success("Examen editado correctamente");
      setCourseData(
        courseData.map((data) =>
          data.id === res.payload.id ? res.payload : data
        )
      );
      setShowUpdateDialog(false);
    }
    setSelectedData(null);
  };

  return loading ? (
    <LoadingPage />
  ) : (
    <div>
      <Header />
      <div className="home-container">
        <Sidebar />
        <div className="flex flex-col justify-center md:flex-row gap-20 p-6 bg-gray-50 min-h-screen w-full">
          {showDialog && (
            <GenericDialog
              title={"Nuevo artículo"}
              description={"Agrega un nuevo artículo a tu curso"}
              open={showDialog}
              type="form"
              onCancel={() => setShowDialog(false)}
              inputs={[
                {
                  type: "text",
                  placeholder: "Título",
                  name: "title",
                  required: true,
                  value: name,
                  onChange: (e) => setName(e.target.value),
                },
                {
                  type: "text",
                  placeholder: "Descripción",
                  name: "description",
                  required: true,
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                },
                {
                  type: "chip",
                  placeholder: "Etiquetas",
                  name: "labels",
                  required: true,
                  chips: chips,
                  setChips: setChips,
                },
                {
                  type: "textarea",
                  placeholder: "Contenido",
                  name: "content",
                  required: true,
                  value: content,
                  onChange: (e) => setContent(e.target.value),
                },
                {
                  type: "file",
                  placeholder: "Imagen",
                  name: "photo",
                  required: true,
                  value: file,
                  onChange: (e) => setFile(e.target.files[0]),
                  file: file,
                  setFile: setFile,
                  fileName: "Subir o arrastrar la imagen de portada",
                  fileType: "IMG, SVG, PNG o JPG",
                },
              ]}
              onConfirm={handleCreateArticle}
            />
          )}
          {showUpdateDialog && (
            <GenericDialog
              title={
                selectedData?.content ? "Editar artículo" : "Editar examen"
              }
              description={
                selectedData?.content
                  ? "Edita un artículo de tu curso"
                  : "Edita un examen de tu curso"
              }
              open={showUpdateDialog}
              type="form"
              onCancel={() => setShowUpdateDialog(false)}
              inputs={
                selectedData?.content
                  ? [
                      {
                        type: "text",
                        placeholder: "Título",
                        name: "title",
                        required: true,
                        value: selectedData?.name,
                        onChange: (e) =>
                          setSelectedData({
                            ...selectedData,
                            name: e.target.value,
                          }),
                      },
                      {
                        type: "text",
                        placeholder: "Descripción",
                        name: "description",
                        required: true,
                        value: selectedData?.description,
                        onChange: (e) =>
                          setSelectedData({
                            ...selectedData,
                            description: e.target.value,
                          }),
                      },
                      {
                        type: "chip",
                        placeholder: "Etiquetas",
                        name: "labels",
                        required: true,
                        chips: selectedData?.labels,
                        setChips: (chips) =>
                          setSelectedData({ ...selectedData, labels: chips }),
                      },
                      {
                        type: "textarea",
                        placeholder: "Contenido",
                        name: "content",
                        required: true,
                        value: selectedData?.content,
                        onChange: (e) =>
                          setSelectedData({
                            ...selectedData,
                            content: e.target.value,
                          }),
                      },
                    ]
                  : [
                      {
                        type: "text",
                        placeholder: "Título",
                        name: "title",
                        required: true,
                        value: selectedData?.name,
                        onChange: (e) =>
                          setSelectedData({
                            ...selectedData,
                            name: e.target.value,
                          }),
                      },
                      {
                        type: "text",
                        placeholder: "Descripción",
                        name: "description",
                        required: true,
                        value: selectedData?.description,
                        onChange: (e) =>
                          setSelectedData({
                            ...selectedData,
                            description: e.target.value,
                          }),
                      },
                      {
                        type: "date",
                        placeholder: "Fecha de entrega",
                        name: "dueDate",
                        required: true,
                        value: selectedData?.endDate,
                        onChange: (e) =>
                          setSelectedData({ ...selectedData, endDate: e }),
                      },
                    ]
              }
              onConfirm={() => {
                updateData();
              }}
            />
          )}
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

            <div className="mt-6">
              <div className="flex justify-end items-center">
                <div
                  className="bg-white rounded-md p-2 flex items-center cursor-pointer border"
                  onClick={() => setShowDialog(true)}
                >
                  <span className="text-xs font-bold text-gray-700 ">
                    Nuevo articulo
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-6 max-h-[60vh] overflow-y-scroll">
              {courseData.map((data, index) => (
                <div
                  key={data.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-6 gap-4 hover: cursor-pointer transition-all shadow-lg"
                >
                  <img
                    src={
                      data?.photo
                        ? data.photo
                        : index % 2 === 0
                        ? pencil
                        : pencilB
                    }
                    alt="Artículo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="flex flex-col justify-between flex-grow mt-10">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{data?.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{data?.description}</p>
                    <div className="items-center text-sm text-gray-500 mt-2">
                      {data.type && (
                        <p>
                          📅 Fecha de entrega:{" "}
                          {new Date(data.endDate).toLocaleDateString() ||
                            new Date().toLocaleDateString()}
                        </p>
                      )}

                      <div className="flex gap-2">
                        {data.labels?.map((sub, idx) => (
                          <span
                            key={idx}
                            className="bg-[#4558C8] text-white px-2 py-1 rounded-md text-xs"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between w-full items-center">
                      <div className="flex items-center gap-2 mt-4">
                        <img
                          src={courseInfo.teacher_id.photo || maleExample}
                          alt={courseInfo.teacher_id.email}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="grid">
                          <span className="text-sm font-semibold">
                            {courseInfo.teacher_id.name}{" "}
                            {courseInfo.teacher_id.lastName}
                          </span>
                          <span className="text-sm text-gray-400">
                            {new Date(data.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[#4558C8] cursor-pointer items-center mt-4"
                        onClick={() => {
                          setSelectedData(data);
                          setShowUpdateDialog(true);
                        }}
                      >
                        Editar
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            <div className="flex justify-center mt-4 gap-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white text-[#4558C8] border border-[#4558C8] disabled:opacity-50"
                >
                    Atrás
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalItems}
                    className="px-4 py-2 rounded-lg bg-white text-[#4558C8] border border-[#4558C8] disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
            </div>
          </div>

          <div className="w-full md:w-1/5 bg-white border border-gray-200 rounded-lg shadow-md p-4 h-fit">
            <h3 className="text-lg font-bold mb-4">Progreso de alumnos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Aquí podrás ver el progreso de tus alumnos en "Cursos"
            </p>
            <div className="relative">
              <TextInput
                type="text"
                placeholder="Buscar alumno"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>
            <div className="flex justify-between items-center mt-6">
              <span className="bg-[#4558C8] text-white px-2 py-1 rounded-md text-xs">
                {selectedModule.name}
              </span>
              <div
                className="flex rounded-md bg-[#F2F4F7] p-2 gap-2 items-center cursor-pointer"
                onClick={changeModule}
              >
                <img src={cycle} alt="Ciclo" className="w-3 h-3" />
                <span className="text-xs">Cambiar curso</span>
              </div>
            </div>
            <ul className="mt-6 space-y-4 p-0">
              {studentsProgress.map((info, idx) => (
                <li key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span>{info.student.name}</span>
                    <span className="text-sm text-[#4558C8]">
                      Nivel {info.progress?.level.order || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#4558C8] h-2 rounded-full"
                      style={{
                        width: `${info.progress?.courseProgress || 0}%`,
                      }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;
