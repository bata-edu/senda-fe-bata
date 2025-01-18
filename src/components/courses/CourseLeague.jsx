import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import graduationIcon from '../../assets/icons/graduation.svg';
import LoadingPage from "../../pages/LoadingPage";
import GenericTable from "../common/table/GenericTable";
import { getCourseLocalStorage, getSchoolLocalStorage } from "../../features/school/schoolSlice";
import Header from "../common/header/Header";
import { fetchRank, fetchUsers } from "../../features/user/userSlice";
import SideBar from "../home/SideBar";
import ilustracionLigas from '../../assets/ilustracion-ligas.svg';

const CourseLeague = () => {
    const dispatch = useDispatch();
    const school = useSelector(getSchoolLocalStorage);
    const course = useSelector(getCourseLocalStorage);
    const [loading, setLoading] = useState(true);
    const courseInfo = getCourseLocalStorage();
    const schoolInfo = getSchoolLocalStorage();
    const { users } = useSelector((state) => state.user || {});
    const [page, setPage] = useState(1);
    
    useEffect(() => {
        getUsers(page);
    }, []);

    const getUsers = async (currentPage) => {
        try {
            const query = { limit : 10, page: currentPage, sortBy: "points:desc", courseId: courseInfo.id };
            await dispatch((fetchUsers({ query }))).unwrap();
        } catch (error) {
            console.error("Error al cargar las entregas:", error);
        } finally {
            setLoading(false);
        }
    }

    const columns = [
        { header: 'Nombre', accessor: 'self', type: 'user' },
        { header: 'Puntaje', accessor: 'points' },
    ];

    const handlePageChange = async (next) => {
        setLoading(true)
        setPage(next);
        await getUsers(next);
    };

    
    return (
        loading ? <LoadingPage/> : (
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
                    <div className="flex flex-col justify-center md:flex-row gap-20 px-6">
                    <div className="">
                        <div className="flex justify-center items-center mb-8">
                            <img src={ilustracionLigas} alt="" />
                        </div>
                        {users && (
                                    <div className="p-6">
                                    <GenericTable
                                        data={users.results}
                                        columns={columns}
                                        totalPages={users.totalPages}
                                        currentPage={page}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                                )}

                    </div>
                    </div>
                </div>
            </div>
        </div>
        )

    );
}

export default CourseLeague;
