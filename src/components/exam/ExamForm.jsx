import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createExam } from '../../features/exam/examSlice';
import { getUser } from '../../features/auth/authService';
import graduationIcon from '../../assets/icons/graduation.svg';
import { useLocation } from 'react-router-dom';
import FileInput from '../common/input/fileInput';

const ExamForm = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [examData, setExamData] = useState({
        name: '',
        description: '',
        questions: [''],
    });
    const [loading, setLoading] = useState(false);
    const {courseInfo, schoolInfo} = location.state;

    const [file, setFile] = useState(null);


    return (
        <div className="flex flex-col justify-center md:flex-row gap-20 p-6 bg-gray-50 min-h-screen">
            <div className="w-1/2">
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

                <div className='mt-6 bg-white rounded-lg  p-4'>
                    <div>
                        <h3 className='text-xl font-bold'>Crear nuevo examen</h3>
                    </div>
                    <div className='mt-4 grid'>
                        <input type="text" placeholder='Titulo' className="w-full  py-2 mb-4 font-semiBold text-xl rounded-lg focus:outline-none focus:none"/>
                        <input type="text" placeholder='Descripcion' className="w-full mb-4  py-2 rounded-lg focus:outline-none focus:none" />
                        <input type="date" placeholder='Fecha de entrega' className='w-full mb-4 py-2 rounder-lg' />
                        <FileInput file={file} setFile={setFile} name={"Subir o arrastrar la cosigna"} type={"HTML, CSS, JS o PY"} />
                    </div>
                </div>
                    </div>
                </div>

    );
};

export default ExamForm;
