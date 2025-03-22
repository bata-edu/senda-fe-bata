import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExamsByCourse } from '../../features/exam/examSlice';
import QuestionsDialog from './QuestionsDialog.jsx';
import SubmissionsDialog from './SubmissionsDialog';
import { useParams } from 'react-router-dom';
import LoadingPage from '../../pages/LoadingPage';

const ExamList = () => {
    const {courseId} = useParams();
    const dispatch = useDispatch();
    const { exams, error } = useSelector((state) => state.exam);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
    const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false);
    const [examId, setExamId] = useState(null);

    useEffect(() => {
        dispatch(getExamsByCourse(courseId)).then(() => setIsLoading(false));
    }, [courseId, dispatch]);

    const handleShowQuestions = (questions) => {
        setSelectedQuestions(questions);
        setShowQuestionsDialog(true);
    };

    const handleShowSubmissions = (examId) => {
        setExamId(examId);
        setShowSubmissionsDialog(true);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Examenes del Curso</h2>
            {isLoading ? (
                <LoadingPage />
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    Error al cargar los exámenes: {error}
                </div>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Título</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Habilitado</th>
                            <th scope="col">Preguntas</th>
                            <th scope="col">Entregas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.length > 0 ? (
                            exams.map((exam, index) => (
                                <tr key={exam.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{exam.name}</td>
                                    <td>{exam.description}</td>
                                    <td>{exam.enabled ? 'Sí' : 'No'}</td>
                                    <td>
                                        <button 
                                            className="btn btn-link p-0" 
                                            onClick={() => handleShowQuestions(exam.questions || [])}>
                                            Ver Preguntas
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-link p-0" 
                                            onClick={() => handleShowSubmissions(exam.id)}>
                                            Ver Entregas
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No hay exámenes cargados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {showQuestionsDialog && (
                <QuestionsDialog 
                    questions={selectedQuestions} 
                    onClose={() => setShowQuestionsDialog(false)} 
                />
            )}

            {showSubmissionsDialog && (
                <SubmissionsDialog 
                    examId={examId}
                    onClose={() => setShowSubmissionsDialog(false)} 
                />
            )}
        </div>
    );
};

export default ExamList;
