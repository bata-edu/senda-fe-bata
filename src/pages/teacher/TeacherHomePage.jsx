import React from "react";
import { fetchSchools } from "../../features/teacher/teacherSlice";
import LoadingPage from "../LoadingPage";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import TeacherHome from "../../components/teacherHome/TeacherHome";

const TeacherHomePage = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSchools();
    }, []);

    const getSchools = async () => {
        await dispatch(fetchSchools());
        setLoading(false);
    };

    return (
        <div>
            {loading ? (
                <LoadingPage />
            ) : (
                <TeacherHome/>
            )}
        </div>
    );
}

export default TeacherHomePage;