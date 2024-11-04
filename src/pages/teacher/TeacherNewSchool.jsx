import React from 'react';
import '../../styles/teacherNewSchool.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getIntoSchool } from '../../features/teacher/teacherSlice';

const TeacherNewSchool = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');

    const handleJoin = async () => {
        setLoading(true);
        await dispatch(getIntoSchool(code))
        navigate('/teacher');
    }

    return (
        <div className="teacher-new-school">
            <div className='close-container'>
                <button className="close-button" onClick={() => navigate("/teacher")}>
                    X
                </button>
            </div>
            <h1>UNIRME A UNA NUEVA INSTITUCION</h1>
            <input 
                type="text" 
                placeholder="Introducir código de la nueva institución" 
                className="institution-input"
                onChange={(e) => setCode(e.target.value)}
                value={code}
            />
            <button 
                className="join-button"
                disabled={loading || !code}
                onClick={handleJoin}
            >
             Unirme
            </button>   
        </div>
    );
}

export default TeacherNewSchool;
