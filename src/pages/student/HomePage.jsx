import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUser } from "../../features/user/userSlice";
import { fetchRank } from "../../features/user/userSlice";
import Sidebar from "../../components/home/SideBar";
import SidebarRight from "../../components/home/SideBarRight";
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

        // await Promise.all([
        //   dispatch(
        //     fetchLevelInfo({ courseId: selectedModule, page, limit: 3 })
        //   ),
        //   dispatch(fetchAllLevels({ courseId: selectedModule })),
        // ]);

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
        <div className="home-container">
          <Sidebar />
          <div className="main-container">
            <Outlet />
          </div>
        </div>
      </>
    );
  }
};

export default Home;
