import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getCourseExams, getExamSubmissionsByExam, getExamsByCourse, gradeSubmission, setActivateExamToCorrect } from "../../features/exam/examSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import graduationIcon from '../../assets/icons/graduation.svg';
import LoadingPage from "../../pages/LoadingPage";
import GenericTable from "../common/table/GenericTable";
import GenericDialog from "../common/dialog/dialog";
import pencilA from '../../assets/pencil.svg';
import Header from "../common/header/Header";
import { getCourseLocalStorage, getSchoolLocalStorage } from "../../features/school/schoolSlice";
import Sidebar from "../home/SideBar";

const ExamCalifications = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const courseInfo = getCourseLocalStorage();
    const schoolInfo = getSchoolLocalStorage();
    const [loading, setLoading] = useState(true);
    const {exams, submissions} = useSelector((state) => state.exam);
    const [selectedExam, setSelectedExam] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [examType, setExamType] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const query = { limit : 999, sortBy: "updatedAt:desc"};
                await dispatch(getExamsByCourse({ courseId: courseInfo.id, query })).unwrap();
            } catch (error) {
                console.error("Error al cargar exámenes:", error);
            }
        };
        fetchExams();
    }, [dispatch, courseInfo.id]);

    useEffect(() => {
        if (exams.length > 0) {
            setSelectedExam(exams[0]);
        }
    }, [exams]);

    const handleExamChange = async (e) => {
        const examId = e.target.value;
        setSelectedExam(exams.find((exam) => exam.id === examId));
    };

    useEffect(() => {
        if (selectedExam) {
            fetchSubmissions(selectedExam.id, page);
            setExamType(parseAssigmentType(selectedExam.type));
        }
    }, [selectedExam]);

    const fetchSubmissions = async (examId, currentPage) => {
        try {
            const query = { limit : 10, page: currentPage, sortBy: "updatedAt:desc"};
            await dispatch((getCourseExams({ courseId: courseInfo.id, examId, query }))).unwrap();
        } catch (error) {
            console.error("Error al cargar las entregas:", error);
        } finally {
            setLoading(false);
        }
    }

    const navigateToProject = async (row) => {
        const id = row.examSubmissions[0]?._id;
        if(id){
            await dispatch(setActivateExamToCorrect(row.examSubmissions[0]));
            const url = `/editor/${id}?teacherRole=$true`;
            navigate(url);
        } else {
            toast.error("No se puede calificar esta entrega");
        }
    };

    useEffect(() => {
        if (submissions) {
            setTotalPages(submissions.totalPages)
        }
    }, [submissions]);

    const handlePageChange = async (next) => {
        setLoading(true)
        setPage(next);
        await fetchSubmissions(selectedExam.id, next);
    };

    const columns = [
        { header: 'Nombre', accessor: 'student', type: 'user' },
        { header: 'Entrego', accessor: 'examSubmissions[0].delay', type: 'delay' },
        { header: 'Nota', accessor: 'examSubmissions[0].score' },
    ];
    
    
    const actions = [{
        label: "Calificar",
        color: "blue",
        onClick: navigateToProject,
    }];

    const parseAssigmentType = (type) => {
        switch (type) {
            case 'EXAM':
                return 'Examen';
            case 'ASSIGNMENT':
                return 'Trabajo Práctico';
            default:
                return 'Tarea';
        }
    }

    return (
        loading ? <LoadingPage/> : (
        <div>
            <Header />
            <div className="home-container">
                <Sidebar />
                <div className="bg-gray-50 min-h-screen w-full">
                    { openDialog &&
                        <GenericDialog
                        title={selectedExam.name}
                        description={selectedExam.description}
                        imageSrc={pencilA}
                        type="info"
                        content={[
                        { type: 'text', value: `Tipo: ${examType}` },
                        { type: 'text', value: `Fecha de finalización: ${new Date(selectedExam.endDate).toLocaleDateString()}` },
                        { type: 'file', fileType: 'pdf', value: selectedExam.question },
                        ]}
                        onCancel={() => setOpenDialog(false)}
                    />
                    }
                    <div className='flex flex-col justify-center md:flex-row gap-20 p-6'>
                    <div className="w-1/4">
                        <div
                            className="animate-bounce-in-down bg-[#F2F4FC] text-[#4558C8] border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <img src={schoolInfo.logo} alt="Logo Instituto" className="h-10 w-10 rounded-full" />
                                    <span className="text-base font-medium">{schoolInfo.name}</span>
                                </div>
                                <img src={graduationIcon} alt="Icono Graduación" className="h-6 w-6 rounded-full items-end" />
                            </div>
                            <h2 className="text-2xl font-bold mt-2">{courseInfo.name}</h2>
                        </div>
                    </div>
                    <div className='w-1/6'>
                        <div className="animate-bounce-in-down bg-white border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md">
                            <div className="grid items-center">
                                <h3 className="text-xl font-bold border-b border-gray-200 pb-3">{selectedExam.name}</h3>
                                <span 
                                    className="text-[#4558C8] font-bold text-sm text-center mb-2 mt-2 cursor-pointer"
                                    onClick={() => setOpenDialog(true)}
                                >
                                    Ver detalle
                                </span>
                            </div>
                        </div>
                    </div>

                    </div>
                    <div className="flex flex-col justify-center md:flex-row gap-20 px-6">
                        <div className='w-1/2 bg-white p-6 rounded-lg'>
                            <div className="px-6">
                                <div className="flex justify-between items-center">
                                    <select
                                        value={selectedExam.id}
                                        onChange={handleExamChange}
                                        className="w-1/2 bg-white border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md"
                                    >
                                        {exams.map((exam) => (
                                            <option key={exam.id} value={exam.id}>
                                                {exam.name}
                                            </option>
                                        ))}
                                    </select>

                                    <span className="font-semibold">{new Date(selectedExam.endDate).toLocaleDateString()}</span>

                                </div>
                            </div>
                            {submissions && (
                                <div className="p-6">
                                <GenericTable
                                    data={submissions.results}
                                    columns={columns}
                                    actions={actions}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    currentPage={page}
                                />
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
        )
)

};

export default ExamCalifications;