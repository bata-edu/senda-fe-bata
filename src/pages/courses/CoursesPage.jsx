import React, { useState } from "react";
import CoursesList from "../../components/courses/CoursesList";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSchoolCourses } from "../../features/school/schoolSlice";
import { getUser } from "../../features/auth/authService";
import LoadingPage from "../LoadingPage";

const CoursesPage = () => {
    const { schoolId } = useParams();
    const dispatch = useDispatch();
    const user = getUser();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getCourses();
    }, [])

    const getCourses = async () => {
        let query;
        if(user.role === 'teacher'){
            query = { teacher_id: user.id };
        }
        await dispatch(fetchSchoolCourses({ schoolId, query }));
        setLoading(false);
    }

    return (
        loading ? <LoadingPage /> :
        <CoursesList />
    );
}

export default CoursesPage;