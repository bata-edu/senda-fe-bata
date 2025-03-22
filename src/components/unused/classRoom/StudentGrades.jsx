import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourseAndSchool } from "../../features/school/schoolSlice";
import { createUserFreeModeProgress } from "../../features/user/userSlice";
import Header from "../common/header/Header";
import SideBarClassroom from "../home/SideBarClassroom";
import LoadingPage from "../../pages/LoadingPage";
import graduationIcon from '../../assets/icons/graduation.svg';
import GenericTable from "../common/table/GenericTable";
import { getExamsByCourse, myGrade } from "../../features/exam/examSlice";
import { useParams } from "react-router-dom";
import { getUser } from "../../features/auth/authService";
import GenericDialog from "../common/dialog/dialog";
import pencilA from '../../assets/pencil.svg';



const StudentGrades = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const course = useSelector((state) => state.school.course);
    const {exams, studentGrade} = useSelector((state) => state.exam);
    const [examSelected, setExamSelected] = useState(null);
    const user = getUser();
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [examType, setExamType] = useState('');
    
    

    useEffect(() => {
        const fetchData = async () => {
            if(!course){
                await dispatch(getCourseAndSchool(id));
            }
            if(!exams.length){
                const query = {
                    limit: 10,
                    sortBy: "updatedAt:desc"
                }
                await dispatch(getExamsByCourse({courseId: id, query}));
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if(exams.length > 0){
            setExamSelected(exams[0]);
        }
    }, [exams]);

    const handleExamChange = async (e) => {
        const examId = e.target.value;
        setExamSelected(exams.find((exam) => exam.id === examId));
    };

    useEffect(() => {
        if(examSelected){
            fetchExamSubmission(examSelected.id);
            setExamType(parseAssigmentType(examSelected.type));
        }
    }, [examSelected]);

    const fetchExamSubmission = async (examId) => {
        const res = await dispatch(myGrade(examId));
            setData([
                {
                    user: user,
                    examSubmissions: res.payload === '' ? [] : [res.payload]
                }
            ])
    }

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

    const columns = [
        { header: 'Nombre', accessor: 'user', type: 'user' },
        { header: 'Entrego', accessor: 'examSubmissions[0].delay', type: 'delay' },
        { header: 'Nota', accessor: 'examSubmissions[0].score' }, 
    ]
    
    return (
        loading ? <LoadingPage /> : (
            <div>
                <Header />
                <div className="home-container">   
                    <SideBarClassroom />
                    <div className="bg-gray-50 min-h-screen w-full">
                    { openDialog &&
                        <GenericDialog
                        title={examSelected.name}
                        description={examSelected.description}
                        imageSrc={pencilA}
                        type="info"
                        content={[
                        { type: 'text', value: `Tipo: ${examType}` },
                        { type: 'text', value: `Fecha de finalización: ${new Date(examSelected.endDate).toLocaleDateString()}` },
                        { type: 'file', fileType: 'pdf', value: examSelected.question },
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
                                    <img src={course.school_id.logo} alt="Logo Instituto" className="h-10 w-10 rounded-full" />
                                    <span className="text-base font-medium">{course.school_id.name}</span>
                                </div>
                                <img src={graduationIcon} alt="Icono Graduación" className="h-6 w-6 rounded-full items-end" />
                            </div>
                            <h2 className="text-2xl font-bold mt-2">{course.name}</h2>
                        </div>
                    </div>
                    <div className='w-1/6'>
                        <div className="animate-bounce-in-down bg-white border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md">
                            <div className="grid items-center">
                                <h3 className="text-xl font-bold border-b border-gray-200 pb-3">{examSelected.name}</h3>
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
                                        value={examSelected.id}
                                        onChange={handleExamChange}
                                        className="w-1/2 bg-white border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md"
                                    >
                                        {exams.map((exam) => (
                                            <option key={exam.id} value={exam.id}>
                                                {exam.name}
                                            </option>
                                        ))}
                                    </select>

                                    <span className="font-semibold">{new Date(examSelected.endDate).toLocaleDateString()}</span>

                                </div>
                            </div>
                            <div className="p-6">
                             <GenericTable
                                data={data}
                                columns={columns}
                                //actions={actions}
                                totalPages={1}
                                currentPage={1}
                            /> 
                        </div>
                        </div>
                    </div>
                </div>
                </div> 
            </div>
        )
    )
}

export default StudentGrades;
