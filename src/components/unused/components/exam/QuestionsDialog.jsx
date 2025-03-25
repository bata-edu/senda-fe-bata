import React from 'react';

const QuestionsDialog = ({ questions, onClose }) => {
    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title">Preguntas del Examen</p>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {questions.length > 0 ? (
                            <ul className="list-group">
                                {questions.map((question, index) => (
                                    <li key={index} className="list-group-item">
                                        {question}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay preguntas disponibles.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionsDialog;