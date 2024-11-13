import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentsInCourse, getCourseById } from '../../features/school/schoolSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingPage from '../../pages/LoadingPage';
import {getUser} from '../../features/auth/authService'

const CourseDashboard = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    let { courseInfo } = location.state || {};
    const {courseId} = useParams();
    const {course, students} = useSelector((state) => state.school);
    const user = getUser();

    useEffect(() => {
        dispatch(getStudentsInCourse(courseId));
        if(!courseInfo){
            dispatch(getCourseById(courseId));
        }
        setLoading(false);
    }, [courseId]);

    const handleLoadExam = () => {
        navigate('/exam/create/' + courseId);
    }

    const handleExamList = () => {
        navigate('/exam/list/' + courseId);
    }

    if (loading) return <div className="text-center mt-4"><LoadingPage /></div>;

    const courseData = courseInfo || course;

    return (
        <div className="container mt-4">
            <div className="text-center mb-4">
                <h2>{courseData?.name}</h2>
            </div>

            <div className="mb-4">
                <h3>Tabla de Posiciones del Aula</h3>
                <ul className="list-group">
                    {students
                        .sort((a, b) => b.points - a.points)
                        .map((student, index) => (
                            <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{index + 1}° {student.name}</span>
                                <span className="badge bg-primary rounded-pill">{student.points} pts</span>
                            </li>
                        ))}
                </ul>
            </div>
            <div>
                {user.role === 'teacher' && (
                <div className="d-flex justify-content-around mt-2">
                    <button className="btn btn-primary" onClick={() => handleLoadExam()}>Crear nuevo examen</button>
                    <button className="btn btn-secondary" onClick={() => handleExamList()}>Exámenes creados</button>
                </div>
                )}
            </div>
            <div>
                {user.role === 'schoolAdmin' && (
                    <div className="d-flex justify-content-around mt-2">
                    <span>{courseData.teacher_id}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDashboard;
