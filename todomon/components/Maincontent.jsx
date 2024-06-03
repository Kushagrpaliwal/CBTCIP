"use client";

import Image from 'next/image';
import { useState } from 'react';
import Todolist, { DeletedTasksContext } from '@/components/content/Todolist';
import Calender from '@/components/content/Calender';
import Notes from '@/components/content/Notes';
import Completed from '@/components/content/Completed';
import { useRouter } from 'next/navigation';
import { logOut } from '@/constants/auth';

const Maincontent = () => {
  const [activeComp, setActiveComp] = useState('Todolist');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [deletedEntries, setDeletedEntries] = useState([]);
  const router = useRouter();

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

  const renderComp = () => {
    switch (activeComp) {
      case 'Todolist':
        return <Todolist setDeletedEntries={setDeletedEntries} />;
      case 'Completed':
        return <Completed setDeletedEntries={setDeletedEntries} />;
      case 'Calender':
        return <Calender />;
      case 'Notes':
        return <Notes />;
      default:
        return <Todolist setDeletedEntries={setDeletedEntries} />;
    }
  };

  return (
    <DeletedTasksContext.Provider value={deletedEntries}>
      <div className="flex flex-row ">
        {sidebarVisible && (
          <div className="flex flex-col w-[450px] h-screen sidebar bg-green3">
            <div className='flex flex-row ml-[30px] mt-[35px]'>
              <Image src="/logo.svg" alt="logo" width={150} height={150} />
              <div className='flex justify-end w-full mr-4'>
                <button onClick={() => setSidebarVisible(false)}>
                  <Image src="/menu.svg" alt="menu" width={20} height={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-col mt-[80px] ml-[30px] mr-4">
              <ul>
                <li
                  className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                  onClick={() => setActiveComp('Todolist')}
                >
                  <Image src="/check.svg" alt="Todolist" width={20} height={20} className='ml-2 mr-2' /> Todolist
                </li>
                <li
                  className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                  onClick={() => setActiveComp('Completed')}
                >
                  <Image src="/note.svg" alt="Completed Tasks" width={20} height={20} className='ml-2 mr-2' /> Completed Tasks
                </li>
                <li
                  className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                  onClick={() => setActiveComp('Calender')}
                >
                  <Image src="/calender.svg" alt="Calender" width={20} height={20} className='ml-2 mr-2' /> Calender
                </li>
                <li
                  className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                  onClick={() => setActiveComp('Notes')}
                >
                  <Image src="/notes.png" alt="Notes" width={20} height={20} className='ml-2 mr-2' /> Notes
                </li>
              </ul>
            </div>
            <div className='flex flex-row mt-[100px] ml-[35px]'>
              <Image src="/log.svg" alt="Logout" width={20} height={20} className='mr-2' />
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
        <div className="flex flex-col p-[80px] w-full h-auto">
          {!sidebarVisible && (
            <button
              onClick={() => setSidebarVisible(true)}
              className="fixed top-4 left-4 z-50 ml-5 mt-5 "
            >
              <Image src="/menu.svg" alt="menu" width={20} height={20} />
            </button>
          )}
          {renderComp()}
        </div>
      </div>
    </DeletedTasksContext.Provider>
  );
};

export default Maincontent;
