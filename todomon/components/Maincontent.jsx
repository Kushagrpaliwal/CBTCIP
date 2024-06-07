"use client"

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Todolist from '@/components/content/Todolist';
import Calender from '@/components/content/Calender';
import Notes from '@/components/content/Notes';
import Completed from '@/components/content/Completed';
import { useRouter } from 'next/navigation';
import { logOut } from '@/constants/auth';

const Maincontent = () => {
  const [activeComp, setActiveComp] = useState('Todolist');
  const [sidebarVisible, setSidebarVisible] = useState(true);  
  const router = useRouter();

  useEffect(() => {

    const savedSidebarState = localStorage.getItem('sidebarVisible');
    if (savedSidebarState) {
      setSidebarVisible(JSON.parse(savedSidebarState));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.clear();
      router.push("./Login");
      console.log("Successfully logged out");
    } catch (error) {
      console.log("Error logging out: " + error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarVisible', JSON.stringify(newState));
      return newState;
    });
  };

  const renderComp = () => {
    switch (activeComp) {
      case 'Todolist':
        return <Todolist />;
      case 'Completed':
        return <Completed />;
      case 'Calender':
        return <Calender />;
      case 'Notes':
        return <Notes />;
    }
  };

  return (
    <div className="flex flex-row">
      {sidebarVisible && (
        <div className="flex flex-col w-[450px] h-screen bg-green3 sidebar">
          <div className='flex flex-row ml-[30px] mt-[35px] '>
            <Image src="/logo.svg" alt="logo" width={150} height={150} />
            <div className=' flex justify-end w-full mr-4 '>
              <button onClick={toggleSidebar}>
                <Image src="/menu.svg" alt="logo" width={20} height={5} />
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-[80px] ml-[30px] mr-4 ">
            <ul>
              {/* Sidebar links */}
              <li className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                onClick={() => setActiveComp('Todolist')}>
                <Image src="/check.svg" alt="logo" width={20} height={5} className=' ml-2 mr-2' /> Todolist </li>
              <li className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                onClick={() => setActiveComp('Completed')}>
                <Image src="/note.svg" alt="logo" width={20} height={5} className='ml-2 mr-2' /> Completed Tasks </li>
              <li className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                onClick={() => setActiveComp('Calender')}>
                <Image src="/calender.svg" alt="logo" width={20} height={5} className=' ml-2 mr-2' /> Calender </li>
              <li className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                onClick={() => setActiveComp('Notes')}>
                <Image src="/notes.png" alt="logo" width={20} height={5} className='ml-2 mr-2' /> Notes </li>
            </ul>
          </div>
          <div className='flex flex-row mt-[100px] ml-[35px]'>
            <Image src="/log.svg" alt="logo" width={20} height={5} className='mr-2' />
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
      <div className="flex flex-col p-[80px] w-full h-auto ">
        {!sidebarVisible && (
          <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 ml-4 mt-5 ">
            <Image src="/menu.svg" alt="menu" width={20} height={5} />
          </button>
        )}
        {renderComp()}
      </div>
    </div>
  );
};

export default Maincontent;
