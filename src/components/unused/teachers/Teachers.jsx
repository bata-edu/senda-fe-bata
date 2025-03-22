import React from "react";
import { useParams } from "react-router-dom";
import { getTeachers } from "../../../features/school/schoolSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Teachers = () => {
    const { schoolId } = useParams();
    const dispatch = useDispatch();
    const teachers = useSelector((state) => state.school.teachers);
    
    useEffect(() => {
        dispatch(getTeachers({schoolId}));
    }, [dispatch, schoolId]);
    
    return (
        <div>
        <h1>Teachers</h1>
        <ul>
            {teachers.map((teacher) => (
            <li key={teacher.id}>{teacher.name}</li>
            ))}
        </ul>
        </div>
    );
    };

export default Teachers;