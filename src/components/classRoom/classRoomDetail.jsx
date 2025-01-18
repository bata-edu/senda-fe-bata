import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getExamsByCourse, myTaskProgress } from "../../features/exam/examSlice";
import { getCourseAndSchool } from "../../features/school/schoolSlice";
import { getCourseArticles } from "../../features/courseArticle/courseArticle";
import { createUserFreeModeProgress, setActiveFreeModeProgress } from "../../features/user/userSlice";
import GenericDialog from "../common/dialog/dialog";
import Header from "../common/header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingPage from "../../pages/LoadingPage";
import graduationIcon from '../../assets/icons/graduation.svg';
import pencil from "../../assets/pencil.svg";
import pencilB from "../../assets/pencilB.svg";
import maleExample from "../../assets/male-example.svg";
import StreaksNDiamonds from "../common/Streaks&Diamons/Streaks&Diamons";
import SideBarClassroom from "../home/SideBarClassroom";



const ClassRoomDetail = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const course = useSelector((state) => state.school.course);
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState();
    const [articleSelected, setArticleSelected] = useState();
    const { freeModeProgress } = useSelector((state) => state.user);
    const [taskList, setTaskList] = useState(false);
    const [loadingTask, setLoadingTask] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        await dispatch(getCourseAndSchool(id));
        const queryTask = {
            limit: 5,
            sortBy: "updatedAt:desc",
            type: 'TASK'
        }
        await fetchCourseData();
        const tasks = await dispatch(getExamsByCourse({courseId: id, query: queryTask})).unwrap();
        await parseTaskProgress(tasks.results);
    }

    const handlePageChange = (nextPage) => {
        setCurrentPage(nextPage);
        fetchCourseData(nextPage);
    };

    const fetchCourseData = async (page) => {
        const query = {
            limit: itemsPerPage,
            sortBy: "updatedAt:desc",
            page: page || 1
        }
        const queryExams = {
            ...query,
            type: '!TASK'
        }
        const res = await Promise.all(
            [
                dispatch(getExamsByCourse({courseId: id, query: queryExams})),
                dispatch(getCourseArticles({courseId: id, query})),
            ]
        )
        const exams = res[0].payload.results;
        const articles = res[1].payload.results;
        const data = [...exams, ...articles];
        data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setCourseData(data);
        setLoading(false); 
    }


    const handleNavigateToFreeCode = async () => {
        const body = {
            name: articleSelected.name,
            examId: articleSelected.id,
        }
        const res = await dispatch(createUserFreeModeProgress({body})).unwrap();
        navigateToEditor(res);

    }

    const navigateToEditor = async (data) => {
        if(data) {
            await dispatch(setActiveFreeModeProgress(data));
            navigate(`/editor/${data.id}?examId=${data.examId}`)
        }
    }

    const parseTaskProgress = async (tasks) => {
        const updatedTaskList = [];
      
        for (let task of tasks) {
          const res = await dispatch(myTaskProgress({ examId: task.id, courseId: id }));
          if (res.payload) {
            const { levelOrder, sectionOrder, progress } = res.payload;
            const progressPercentage = calculateProgressPercentage(levelOrder, sectionOrder, progress);
                  updatedTaskList.push({
              ...task,
              progress: progressPercentage,
              levelOrder, 
            sectionOrder,
            });
          } else {
            updatedTaskList.push({ ...task });
          }
        }
        setTaskList(updatedTaskList);
        setLoadingTask(false);
      };
      

    const calculateProgressPercentage = (levelOrder, sectionOrder, progress) => {
        if (progress.levelOrder === levelOrder && progress.sectionOrder === sectionOrder) {
          return 100;
        }
      
        if (progress.levelOrder === levelOrder) {
          return (progress.sectionOrder / sectionOrder) * 100;
        }
      
        if (progress.levelOrder < levelOrder) {
          return (progress.levelOrder / levelOrder) * 100;
        }
      
        return 0;
      };
      

    return (
        loading ? <LoadingPage/> : (
        <div>
            <Header />
            <div className="home-container">
                <SideBarClassroom />
                <div className="bg-gray-50 min-h-screen w-full">
                {showDialog && 
                    <GenericDialog
                        title={articleSelected?.name}
                        imageSrc={articleSelected?.photo ? articleSelected.photo : pencil}
                        type="info"
                        content={[
                            {type: 'text', value: articleSelected?.description},
                            {type: 'text', value: `Fecha de entrega: ${articleSelected?.dueDate || new Date().toLocaleDateString()}`},
                            {type: 'button', value: 'Comenzar', onClick: handleNavigateToFreeCode, color: '#E0F47E'}
                        ]}
                        onCancel={() => setShowDialog(false)}
                    />
                }
                <div className='flex justify-center md:flex-row gap-20 p-6'>
                    <div className="w-1/4">
                        <div
                            className="animate-bounce-in-down bg-[#F2F4FC] text-[#4558C8] border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md"
                        >
                            <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <img src={course.school_id.logo} alt="Logo Instituto" className="h-10 w-10 rounded-full" />
                                <span className="text-base font-medium">{course.school_id.name}</span>
                            </div>
                            <img src={graduationIcon} alt="Icono Graduación" className="h-6 w-6 rounded-full items-end" />
                            </div>
                            <h2 className="text-2xl font-bold mt-2">{course.name}</h2>
                        </div>
                        <div className="mt-4 space-y-6 max-h-[60vh] overflow-y-scroll">
                        {courseData.map((data, index) => (
                            <div
                            key={data.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 gap-4 hover: cursor-pointer transition-all shadow-lg"
                            onClick={() => {setShowDialog(true); setArticleSelected(data)}}
                            >
                            <img
                                src={data?.photo ? data.photo : (index % 2 === 0 ? pencil : pencilB)}
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
                                        📅 Fecha de entrega: {data.dueDate || new Date().toLocaleDateString()}
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
                                        src={course.teacher_id.photo || maleExample}
                                        alt={course.teacher_id.email}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="grid">
                                        <span className="text-sm font-semibold">{course.teacher_id.name} {course.teacher_id.lastName}</span>
                                        <span className="text-sm text-gray-400">
                                            {new Date(data.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        ))}
                          <div className="flex justify-center mt-4 gap-2">
                                    {Array.from({ length: Math.ceil(courseData.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-[#4558C8] text-white' : 'bg-white text-[#4558C8] border border-[#4558C8]'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/5">
                        <StreaksNDiamonds noPadding={true}/>
                        <div className="w-full mt-10 bg-white border border-gray-200 rounded-lg shadow-md p-4 h-fit">
                        <h3 className="text-lg font-bold mb-4">Listado de tareas</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Aquí podrás ver tu progreso de tareas en "Cursos"
                        </p>
                        <hr className="border-t border-gray-800 my-4" />
                        {loadingTask ? <LoadingPage/> :
                            <ul className="mt-6 space-y-4 p-0">
                                {taskList.map((task, idx) => (
                                    <li key={idx}>
                                        <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">{task.name}</span>
                                        <span className="text-sm text-[#4558C8]">Nivel: {task.levelOrder}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#4558C8] h-2 rounded-full"
                                            style={{ width: `${task.progress || 0}%` }}
                                        ></div>
                                        </div>
                                        <hr className="border-t border-gray-800 my-4" />

                                    </li>
                                ))}
                            </ul>
                            }
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        )
  );

}

export default ClassRoomDetail;