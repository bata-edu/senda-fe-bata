import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createExam } from '../../features/exam/examSlice';
import { getUser } from '../../features/auth/authService';
import graduationIcon from '../../assets/icons/graduation.svg';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePickerInput from '../common/input/dateInput';
import Header from '../common/header/Header';
import { getCourseLocalStorage, getSchoolLocalStorage } from '../../features/school/schoolSlice';
import Sidebar from '../home/SideBar';
import { fetchModulesInfo } from '../../features/module/moduleSlice';
import { fetchAllLevels } from '../../features/level/levelSlice';
import { fetchSections } from '../../features/section/sectionSlice';

const TaskForm = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [examData, setExamData] = useState({
        name: '',
        description: '',
        endDate: '',
        questionText: '',
        selectedModule: '',
        selectedLevel: '',
        selectedSection: ''
    });
    const [loading, setLoading] = useState(false);

    const schoolInfo = getSchoolLocalStorage();
    const courseInfo = getCourseLocalStorage();
    const { modules } = useSelector((state) => state.modules || { modules: [] });
    const { levels } = useSelector((state) => state.level || { levels: [] });
    const { sections } = useSelector((state) => state.section || { sections: [] });

    useEffect(() => {
        dispatch(fetchModulesInfo());
    }, [dispatch]);

    useEffect(() => {
        if (examData.selectedModule) {
            dispatch(fetchAllLevels({courseId: examData.selectedModule}));
        }
    }, [dispatch, examData.selectedModule]);

    useEffect(() => {
        if (examData.selectedLevel) {
            dispatch(fetchSections(examData.selectedLevel));
        }
    }, [dispatch, examData.selectedLevel]);

    const submitExam = async () => {
        try {
            const body = {
                name: examData.name,
                description: '',
                schoolCourse: courseId,
                section: examData.selectedSection,
                teacher_id: getUser().id,
                endDate: examData.endDate,
                question: '',
                type: 'TASK'
            };
            await dispatch(createExam({ exam: body }));
            toast.success("Examen creado correctamente");
        } catch (error) {
            console.error('Error al crear el examen:', error);
        }
    };

    return (
        <div>
            <Header />
            <div className='home-container'>
                <Sidebar />
                <div className="bg-gray-50 w-full min-h-screen">
                    <div className='flex flex-col justify-center md:flex-row gap-20 p-6'>
                        <div className="w-1/2">
                            <div className='w-1/2'>
                                <div
                                    className="animate-bounce-in-down bg-[#F2F4FC] text-[#4558C8] border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                            <img src={schoolInfo.logo} alt="Logo Instituto" className="h-10 w-10 rounded-full" />
                                            <span className="text-base font-medium">{schoolInfo.name} | {courseInfo.name}</span>
                                        </div>
                                        <img src={graduationIcon} alt="Icono Graduación" className="h-6 w-6 rounded-full items-end" />
                                    </div>
                                    <h2 className="text-2xl font-bold mt-2">Tareas</h2>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='flex flex-col justify-center md:flex-row gap-20 p-6'>
                        <div className='w-1/2 bg-white p-6 rounded-lg'>
                            <div>
                                <h3 className='text-xl font-bold'>Crear nueva Tarea</h3>
                            </div>
                            <div className='mt-4 grid'>
                                <input
                                    type="text"
                                    placeholder='Título'
                                    value={examData.name}
                                    onChange={(e) => setExamData({ ...examData, name: e.target.value })}
                                    className="w-full py-2 mb-4 font-semiBold text-xl rounded-lg focus:outline-none focus:none" />

                                <div className='mt-4 flex gap-3'>
                                    <select
                                        value={examData.selectedModule}
                                        onChange={(e) => setExamData({ ...examData, selectedModule: e.target.value, selectedLevel: '', selectedSection: '' })}
                                        className="w-full mb-4 py-2 rounded-lg border focus:outline-none">
                                        <option value="">Seleccionar Módulo</option>
                                        {modules && modules.map((module) => (
                                            <option key={module.id} value={module.id}>{module.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={examData.selectedLevel}
                                        onChange={(e) => setExamData({ ...examData, selectedLevel: e.target.value, selectedSection: '' })}
                                        className="w-full mb-4 py-2 rounded-lg border focus:outline-none"
                                        disabled={!examData.selectedModule}>
                                        <option value="">Seleccionar Nivel</option>
                                        {levels && levels.map((level) => (
                                            <option key={level.id} value={level.id}>{level.order}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={examData.selectedSection}
                                        onChange={(e) => setExamData({ ...examData, selectedSection: e.target.value })}
                                        className="w-full mb-4 py-2 rounded-lg border focus:outline-none"
                                        disabled={!examData.selectedLevel}>
                                        <option value="">Seleccionar Sección</option>
                                        {sections && sections.map((section) => (
                                            <option key={section.id} value={section.id}>{section.name}</option>
                                        ))}
                                    </select>
                                </div>


                                <DatePickerInput
                                    label="Fecha de entrega"
                                    value={examData.endDate}
                                    onChange={(value) => setExamData({ ...examData, endDate: value })}
                                    placeholder="Fecha de entrega"
                                />
                            </div>
                            <div className='flex w-full'>
                                <button 
                                    className='text-white px-4 py-2 rounded-lg mt-4 w-full active: bg-[#4558C8] disabled:bg-gray-300 cursor-not-allowed'
                                    disabled={(!examData.name || !examData.endDate || !examData.selectedSection || loading )}
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

export default TaskForm;
