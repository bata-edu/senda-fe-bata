import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCourse } from '../../features/school/schoolSlice';
import { useNavigate, useParams } from 'react-router-dom';

const CreateCourseForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {schoolId} = useParams();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const payload = {
                school_id: schoolId,
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : '',
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : ''
            };
            await dispatch(createCourse(payload));
            navigate(`/courses/${schoolId}`);
        } catch (error) {
            console.error(error);
        }
        
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
            <h3 className="mb-4">Crear Nuevo Curso</h3>

            <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre del Curso</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Descripción</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="startDate" className="form-label">Fecha de Inicio</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="form-control"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="endDate" className="form-label">Fecha de Fin</label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="form-control"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary w-100">Crear Curso</button>
        </form>
    );
};

export default CreateCourseForm;
