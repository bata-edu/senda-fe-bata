import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getExamSubmissionsByExam, getExamsByCourse, gradeSubmission } from "../../features/exam/examSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import graduationIcon from '../../assets/icons/graduation.svg';
import LoadingPage from "../../pages/LoadingPage";
import GenericTable from "../common/table/GenericTable";



const ExamCalifications = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const {courseInfo, schoolInfo} = location.state;
    const [loading, setLoading] = useState(true);
    const {exams, submissions} = useSelector((state) => state.exam);
    const [selectedExam, setSelectedExam] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchExams(courseInfo.id);
    }, [dispatch, courseInfo]);

    const fetchExams = async (courseId) => {
        if(exams.length === 0) {
            await dispatch(getExamsByCourse({courseId}));
        }
        setSelectedExam(exams[0]);
        setLoading(false);
    };

    const handleExamChange = async (e) => {
        const examId = e.target.value;
        await dispatch(getExamSubmissionsByExam(examId));
        //setTotalPages(submissions.totalResults)
    };

    const handleGradeSubmission = async (submission, score) => {
        setLoading(true);
        try {
            await dispatch(gradeSubmission({id: submission.id, score}));
            toast.success("Calificación guardada");
        } catch (error) {
            toast.error("Error al guardar la calificación");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Nombre', accessor: 'student', type: 'user' },
        { header: 'Entrego', accessor: 'delay', type: 'delay' },
        { header: 'Nota', accessor: 'score' },
      ];
    const actions = [{
        label: "Calificar",
        color: "blue",
        onClick: handleGradeSubmission,
    }];

    return (
        loading ? <LoadingPage/> : (
        <div className="bg-gray-50 min-h-screen">
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
                        <h3 className="text-xl font-bold border-b border-gray-200 pb-3">{selectedExam?.name}</h3>
                        <span
                            className="text-[#4558C8] font-bold text-sm text-center mb-2 mt-2 cursor-pointer"
                        >
                            Ver detalle
                        </span>
                    </div>
                </div>
            </div>

            </div>
            <div>
                <select
                    value={selectedExam?.id}
                    onChange={handleExamChange}
                    className="w-1/4 bg-white border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md"
                >
                    {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                            {exam.name}
                        </option>
                    ))}
                </select>
            </div>
            {submissions && (
                <div className="p-6">
                <GenericTable
                    data={submissions.results}
                    columns={columns}
                    actions={actions}
                    totalPages={1}
                />
            </div>
            )}
        </div>
        )
)

};

export default ExamCalifications;