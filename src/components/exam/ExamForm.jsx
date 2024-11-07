import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createExam } from '../../features/exam/examSlice';
import { getUser } from '../../features/auth/authService';

const ExamForm = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [examData, setExamData] = useState({
        name: '',
        description: '',
        questions: [''],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExamData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[index] = value;
        setExamData((prevData) => ({
            ...prevData,
            questions: updatedQuestions,
        }));
    };

    const addQuestion = () => {
        setExamData((prevData) => ({
            ...prevData,
            questions: [...prevData.questions, ''],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = getUser();
        const examPayload = { ...examData, schoolCourse: courseId, teacher_id: user.id };
        await dispatch(createExam(examPayload));
        navigate("/teacher/course/" + courseId);
    };

    return (
        <div className="container mt-4">
            <h3>Cargar Examen para el Curso</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre del Examen</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={examData.name}
                        onChange={handleChange}
                        placeholder="Ingrese el nombre del examen"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={examData.description}
                        onChange={handleChange}
                        placeholder="Descripción del examen"
                        required
                    />
                </div>

                <label className="form-label">Preguntas</label>
                {examData.questions.map((question, index) => (
                    <div key={index} className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={question}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            placeholder={`Pregunta ${index + 1}`}
                            required
                        />
                    </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addQuestion}>
                    Agregar Pregunta
                </button>

                <div className="mt-4">
                    <button type="submit" className="btn btn-primary">
                        Guardar Examen
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExamForm;
