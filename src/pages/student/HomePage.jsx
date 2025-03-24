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
  const { selectedModule } = useSelector((state) => state.modules || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        <div className="grid md:grid-cols-[auto_1fr] h-[90vh]">
          {/* Sidebar fijo */}
          <Sidebar className="hidden md:block" />
          {/* Contenedor principal con margen para el Sidebar */}
          <div className="w-full bg-gray-100 h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </>
    );
  }
};

export default Home;
