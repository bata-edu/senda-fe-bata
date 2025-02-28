import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchRank } from "../../features/user/userSlice";
import Sidebar from "../../components/home/SideBar";
import "../../styles/home.css";
import { Outlet } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import Header from "../../components/common/header/Header";

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { page, levels } = useSelector((state) => state.level || {});
  const { selectedModule } = useSelector((state) => state.modules || {});

  useEffect(() => {
    if (levels && levels.length) {
      return;
    }
    const fetchData = async () => {
      try {
        if (localStorage.getItem("accessToken")) {
          dispatch(fetchRank());
        }
        if (!selectedModule) return;
        setLoading(true);

        dispatch(fetchUser());
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(true);
      }
    };
    fetchData();
  }, [dispatch, selectedModule]);

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <>
        <Header />
        <div className="flex h-[90vh]">
          {/* Sidebar fijo */}
          <Sidebar className="fixed top-0 left-0 h-full w-6 bg-white shadow-md z-10" />
          {/* Contenedor principal con margen para el Sidebar */}
          <div className="ml-6 w-full bg-gray-100 h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </>
    );
  }
};

export default Home;
