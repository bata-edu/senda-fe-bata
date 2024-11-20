import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../features/auth/authService";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSchoolById } from "../../features/school/schoolSlice";

const SchoolAdminHomePage = () => {
    const navigate = useNavigate();
    const user = getUser();
    const schoolId = user.schoolData.schools[0]
    const dispatch = useDispatch();
    const school = useSelector((state) => state.school.school);

    useEffect(() => {
        dispatch(getSchoolById(schoolId));    
    }, []);

    const handleProfessors = () => {
        navigate("/professors/" + schoolId);
    }

    const handleClassrooms = () => {
        navigate("/courses/" + schoolId);
    }

    if(!school) {
        return <div>Loading...</div>
    }

    return (
        <div class="container mt-5">
            <div class="card mb-4">
                <div class="card-header d-flex align-items-center justify-content-center">
                    <img src={school.logo} alt="school logo" class="img-fluid rounded-circle me-3" style={{width:'90px', height:'90px'}}/>
                    <h3 class="mb-0">{school.name}</h3>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <strong>Código:</strong>
                            <p>{school.code}</p>
                        </div>
                        <div class="col-md-4">
                            <strong>ID:</strong>
                            <p>{school.id}</p>
                        </div>
                        <div class="col-md-4">
                            <strong>Email:</strong>
                            <p>{school.email}</p>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <strong>Teléfono:</strong>
                            <p>{school.phone}</p>
                        </div>
                        <div class="col-md-4">
                            <strong>Sitio Web:</strong>
                            <p>{school.website}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-3">
                <div class="btn-group">
                    <button class="btn btn-primary" onClick={handleProfessors}>Profesores</button>
                    <button class="btn btn-primary" onClick={handleClassrooms}>Aulas</button>
                </div>
            </div>
        </div>
    );
}

export default SchoolAdminHomePage;