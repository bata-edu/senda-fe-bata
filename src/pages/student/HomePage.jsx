import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/home/SideBar";
import "../../styles/home.css";
import { Outlet, useLocation } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import Header from "../../components/common/header/Header";

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { selectedModule } = useSelector((state) => state.modules || {});
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    const isFocus = location.pathname.includes('/sections/') 
    setShowSidebar(!isFocus)
  }, [location])

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        <div className={`grid h-[90vh]  
          ${showSidebar ? "md:grid-cols-[auto_1fr]" : "grid-cols-1"}`}>
          {/* Sidebar fijo */}

          {showSidebar && 
          <Sidebar className="hidden md:block" />
          }
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
