import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../styles/teacherHome.css';

const TeacherHome = () => {
  const {teacherSchools} = useSelector((state) => state.teacher);
  const navigate = useNavigate();

  const handleAddSchool = () => {
    navigate('/teacher/new-school');
  };

  const handleSchoolClick = (schoolId) => {
    navigate(`/courses/${schoolId}`);
  }

  return (
    <div className="teacher-home">
      <h1>Colegios</h1>
      <div className="school-grid">
        {teacherSchools.map((school) => (
          <div key={school.id} className="school-card" onClick={() => handleSchoolClick(school.id)}>
            <span>{school.name}</span>
          </div>
        ))}
        <div className="school-card add-new"  onClick={() => handleAddSchool()}>
          <span className="add-icon">+</span>
          <span className="add-text">agrega un nuevo colegio</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
