import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import graduationIcon from '../../assets/icons/graduation.svg';
import LoadingPage from "../../pages/LoadingPage";
import GenericTable from "../common/table/GenericTable";
import { getCourseLocalStorage, getSchoolLocalStorage } from "../../features/school/schoolSlice";
import Header from "../common/header/Header";
import { fetchRank } from "../../features/user/userSlice";
import SideBar from "../home/SideBar";

const CourseLeague = () => {
    const dispatch = useDispatch();
    const school = useSelector(getSchoolLocalStorage);
    const course = useSelector(getCourseLocalStorage);
    const [loading, setLoading] = useState(true);
    const courseInfo = getCourseLocalStorage();
    const schoolInfo = getSchoolLocalStorage();
    const { rank } = useSelector((state) => state.user || {});
    
    
    useEffect(() => {
        dispatch(fetchRank()).then(() => {
        setLoading(false);
        });
    }, [dispatch, school.id, course.id]);

    
    
    return (
        <div>
            <Header />
            <div className="home-container">
                <SideBar />
                <div className="bg-gray-50 min-h-screen w-full">
                <div className='flex flex-col justify-center md:flex-row gap-20 p-6'>
                    <div className="w-1/4">
                        <div
                            className="animate-bounce-in-down bg-[#F2F4FC] text-[#4558C8] border border-blue-200 rounded-lg px-6 py-3 items-center gap-4 shadow-md"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <img src={schoolInfo.logo} alt="Logo Instituto" className="h-10 w-10 rounded-full" />
                                    <span className="text-base font-medium">{schoolInfo.name}</span>
                                </div>
                                <img src={graduationIcon} alt="Icono Graduación" className="h-6 w-6 rounded-full items-end" />
                            </div>
                            <h2 className="text-2xl font-bold mt-2">{courseInfo.name}</h2>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseLeague;
