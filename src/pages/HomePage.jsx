import React from 'react';
import Sidebar from '../components/home/SideBar';
import MainContent from '../components/home/MainContent';
import SidebarRight from '../components/home/SideBarRight';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <MainContent />
      <SidebarRight />
    </div>
  );
};

export default Home;
