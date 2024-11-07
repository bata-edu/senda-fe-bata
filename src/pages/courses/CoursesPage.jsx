import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSchoolCourses } from "../../features/school/schoolSlice";
import { getUser } from "../../features/auth/authService";

const CoursesPage = () => {
    const { schoolId } = useParams();
    const dispatch = useDispatch();
    const { courses } = useSelector((state) => state.school);
    const user = getUser();
    const navigate = useNavigate();
    
    useEffect(() => {
        let query;
        if(user.role === 'teacher'){
            query = { teacher_id: user.id };
        }
        dispatch(fetchSchoolCourses({ schoolId, query }));
    }, [dispatch, schoolId]);
    
    const handleAddCourse = () => {
        navigate(`/courses/${schoolId}/new`);
    };

    const handleNavigateToCourse = (course) => {
        navigate('/teacher/course/' + course.id, { state: { courseInfo: course } });
    }

    return (
        <div>
        <h1>Courses</h1>
        <ul>
            {courses.map((course) => (
            <li key={course.id} onClick={() => handleNavigateToCourse(course)}>{course.name}</li>
            ))}
        </ul>
        <div onClick={() => handleAddCourse()}>
          <span>+</span>
          <span>agrega un nuevo curso</span>
        </div>
      </div>
    );
}

export default CoursesPage;