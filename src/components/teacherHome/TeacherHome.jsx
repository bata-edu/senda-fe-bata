import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import left from '../../assets/icons/corchete izquierdo.svg';
import right from '../../assets/icons/corchete derecho.svg';

const TeacherHome = () => {
  const { teacherSchools } = useSelector((state) => state.teacher);
  const navigate = useNavigate();

  const handleAddSchool = () => {
    navigate('/teacher/new-school');
  };

  const handleSchoolClick = (schoolId) => {
    navigate(`/courses/${schoolId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-grayBg">
      <header className="flex">
        <img src={left} alt="Corchete izquierdo" className="h-10 mt-2" />
        <h1 className="text-5xl text-gray-800 mb-12">
          Selecciona una institución
        </h1>
        <img src={right} alt="Corchete derecho" className="h-10 mt-2" />
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 w-4/5 max-w-5xl px-6">
        {teacherSchools.map((school) => (
          <div
            key={school.id}
            className="relative bg-darkBlue text-white shadow-[0_8px_3px_rgba(49,55,119,1)] p-6 hover:shadow-[0_12px_3px_rgba(49,55,119,1)] transition-all cursor-pointer"
            style={{borderRadius: '1.5rem'}}
            onClick={() => handleSchoolClick(school.id)}
          >
            <span className="text-4xl font-semibold block mb-4">{school.name}</span>
            <div className="flex-inline items-center text-lg">
              <span className="mr-2">􀎟 3 aulas</span> 
            </div>
            <div className="absolute bottom-4 right-4 bg-[#E1E7F8] text-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg">
              <span className='font-medium text-3xl text-[#4558C8]'> ➔</span>
            </div>
          </div>
        ))}

    <div
      className="relative flex flex-col justify-between bg-[#F2F4FC] text-[#4558C8] rounded-lg shadow-[0_8px_0px_0px_rgba(202,213,243,1)] p-6 hover:shadow-[0_12px_0px_0px_rgba(202,213,243,1)] transition-all cursor-pointer"
      onClick={handleAddSchool}
    >
      <div>
        <span className="text-4xl font-bold block mb-4">Cargar nueva</span>
        <span className="text-lg font-medium text-[#4558C8]">Añade una nueva institución</span>
      </div>
      <div className="absolute bottom-3 right-3 bg-darkBlue text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
        <span className='font-medium text-3xl'>+</span>
      </div>
    </div>  
    </div>
  </div>
  );
};

export default TeacherHome;
