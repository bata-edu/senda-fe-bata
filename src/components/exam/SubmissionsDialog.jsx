import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExamSubmissionsByExam, gradeSubmission } from '../../features/exam/examSlice';
import jsPDF from 'jspdf';
import LoadingPage from '../../pages/LoadingPage';

const SubmissionsDialog = ({ examId, onClose }) => {
    const dispatch = useDispatch();
    const { submissions, error } = useSelector((state) => state.exam);
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [score, setScore] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getExamSubmissionsByExam(examId)).then(() => setLoading(false));
    }, [examId, dispatch]);

    const handleExportToPDF = (submission) => {
        const doc = new jsPDF();
        doc.text(`Estudiante: ${submission.student.email}`, 10, 10);
        doc.text(`Respuestas: ${submission.answers.join(', ')}`, 10, 20);
        doc.text(`Puntuación: ${submission.score ?? 'Sin corregir'}`, 10, 30);
        doc.save(`entrega_${submission.student.email}.pdf`);
    };

    const handleGradeSubmission = (submission) => {
        setGradingSubmission(submission);
    };

    const handleSubmitGrade = () => {
        if (gradingSubmission && score) {
            dispatch(gradeSubmission({ id: gradingSubmission.id, score })).then(() => {
                setGradingSubmission(null);
                setScore('');
                dispatch(getExamSubmissionsByExam(examId)); // Refresh the list after grading
            });
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title">Entregas del Examen</p>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <LoadingPage />
                        ) : error ? (
                            <p className="text-danger">Error: {error}</p>
                        ) : submissions.length > 0 ? (
                            <ul className="list-group">
                                {submissions.map((submission, index) => (
                                    <li key={index} className="list-group-item">
                                        <strong>Estudiante:</strong> {submission.student.email} <br />
                                        <strong>Respuestas:</strong> {submission.answers.join(', ')} <br />
                                        <strong>Puntuación:</strong> {submission.score ?? (
                                            <>
                                                <button 
                                                    className="btn btn-warning btn-sm" 
                                                    onClick={() => handleGradeSubmission(submission)}
                                                >
                                                    Corregir
                                                </button>
                                            </>
                                        )} <br />
                                        <button 
                                            className="btn btn-primary btn-sm mt-2" 
                                            onClick={() => handleExportToPDF(submission)}
                                        >
                                            Exportar a PDF
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay entregas disponibles.</p>
                        )}
                    </div>
                    {gradingSubmission && (
                        <div className="mt-3">
                            <p>Calificar Entrega de {gradingSubmission.student.email}</p>
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Ingresa la nota"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                            />
                            <button 
                                className="btn btn-success"
                                onClick={handleSubmitGrade}
                            >
                                Enviar Nota
                            </button>
                            <button 
                                className="btn btn-secondary ms-2"
                                onClick={() => {
                                    setGradingSubmission(null);
                                    setScore('');
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionsDialog;