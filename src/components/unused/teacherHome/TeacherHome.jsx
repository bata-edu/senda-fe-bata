import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import left from '../../assets/icons/corchete-izquierdo.svg';
import right from '../../assets/icons/corchete-derecho.svg';
import { getIntoSchool } from '../../../features/teacher/teacherSlice';
import { useDispatch } from 'react-redux';
import GenericDialog from '../../common/dialog/dialog';
import { saveSchoolLocalStorage } from '../../../features/school/schoolSlice';

const TeacherHome = () => {
  const dispatch = useDispatch();
  const { teacherSchools } = useSelector((state) => state.teacher);
  const [showDialog, setShowDialog] = useState(false);
  const [code, setCode] = useState('');

  const navigate = useNavigate();

  const handleSchoolClick = (school) => {
    saveSchoolLocalStorage(school);
    navigate(`/courses/${school.id}`);
  };

  const handleJoin = async () => {
    await dispatch(getIntoSchool(code));
    setCode('');
    setShowDialog(false);
  }
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-grayBg">
      <header className="flex mt-20 gap-10">
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
            onClick={() => handleSchoolClick(school)}
          >
            <span className="text-4xl font-semibold block mb-10">{school.name}</span>
            <div className="flex justify-between">
              <img src={school.logo} alt="Logo escuela" className='rounded-full w-12 h-12' />
              <div className="bottom-4 right-4 bg-[#E1E7F8] text-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg">
                <span className='font-medium text-3xl text-[#4558C8]'> ➔</span>
              </div>
            </div>
          </div>
        ))}

    <div
      className="relative flex flex-col justify-between bg-[#F2F4FC] text-[#4558C8] rounded-lg shadow-[0_8px_0px_0px_rgba(202,213,243,1)] p-6 hover:shadow-[0_12px_0px_0px_rgba(202,213,243,1)] transition-all cursor-pointer"
      onClick={() => setShowDialog(true)}
    >
      <div>
        <span className="text-4xl font-bold block mb-10">Cargar nueva</span>
        <div className="flex justify-between">
          <span className="text-lg font-medium text-[#4558C8]">Añade una nueva institución</span>
          <div className="bottom-3 right-3 bg-darkBlue text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
            <span className='font-medium text-3xl' style={{marginTop:'-5px'}}>+</span>
          </div>
        </div>
      </div>
    </div>  
    </div>
    <div>
        {showDialog &&
          <GenericDialog 
          type="form"
          title={"Ingresar a una institución"}
          description={"Ingresa el codigo de la institución a la que deseas unirte."}
          inputs={[{ placeholder: "Codigo", type: "text", value: code, onChange: (e) => setCode(e.target.value) }] }
          confirmButtonText={"Enviar"}
          cancelButtonText={"Cancelar"} 
          onCancel={() =>{ setShowDialog(false); setCode('')}} 
          onConfirm={handleJoin}
          />
      }
      </div>
  </div>
  );
};

export default TeacherHome;
