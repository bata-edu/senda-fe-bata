import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLevels, fetchLevelInfo } from '../features/level/levelSlice';
import { fetchUser } from '../features/user/userSlice';
import { fetchUserProgress } from '../features/userProgress/userProgressSlice';
import Sidebar from '../components/home/SideBar';
import SidebarRight from '../components/home/SideBarRight';
import '../styles/home.css';
import { Outlet } from 'react-router-dom';
import LoadingPage from './LoadingPage';


const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { page } = useSelector((state) => state.level || {});

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await dispatch(fetchUserProgress()).unwrap();
        if(response.length > 0){
          await Promise.all([
            dispatch(fetchLevelInfo({ courseId: response[0].course, page, limit: 3 })),
            dispatch(fetchAllLevels({ courseId: response[0].course }))
          ]);
        }
        dispatch(fetchUser())
        setLoading(false);
      } catch (error) {
        console.log('Error loading data:', error);
        setLoading(true)
      }
    };
    fetchData();
  }, [dispatch]);

  if (loading) {
    return <LoadingPage/>;
  }

  return (
    <div className="home-container">
      <Sidebar />
      <div className='main-container'>
        <Outlet />
      </div>
      <SidebarRight />
    </div>
  );
};

export default Home;
