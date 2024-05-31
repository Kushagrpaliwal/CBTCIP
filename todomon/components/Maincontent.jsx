"use client";

import Image from 'next/image'
import Link from "next/link"
import {mainlinks} from '@/constants/index'
import { useState } from 'react';
import Todolist from '@/components/content/Todolist'
import Calender from '@/components/content/Calender'
import Timer from '@/components/content/Timer'
import Notes from '@/components/content/Notes'

const Maincontent = () => {

    const [activecomp,SetActivecomp] = useState('Todolist');
    const [sidebar,Setsidebar] = useState();

    const rendercomp = () => {
            switch (activecomp){
                case 'Todolist' :
                    return <Todolist/>;
                case 'Notes' :
                    return <Notes/>;
                case 'Calender' :
                    return <Calender/>;
                case 'Timer' :
                    return <Timer/>;
            }
    }

    return (
        <div className="flex flex-row">
            <div className="flex flex-col w-[450px] h-screen sidebar">
                <div className='flex flex-row ml-[30px] mt-[35px] '>
                    <Image src="/logo.svg" alt="logo" width={150} height={150} />
                    <div className=' flex justify-end w-full mr-4 '>
                        <button onClick={menubar}>
                            <Image src="/menu.svg" alt="logo" width={20} height={5}  />
                        </button>
                    </div>
                </div>
                    <div className="flex flex-col mt-[80px] ml-[30px] mr-4 ">
                          <ul>
                            <li className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white' 
                                onClick={()=> SetActivecomp('Todolist')}>                            
                                <Image src="/check.svg" alt="logo" width={20} height={5} className=' ml-2 mr-2'/> Todolist </li>
                            <li className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                                onClick={() => SetActivecomp('Notes')}>                            
                                <Image src="/note.svg" alt="logo" width={20} height={5} className='ml-2 mr-2'/> Notes </li>
                            <li className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                                onClick={()=> SetActivecomp('Calender')}>                            
                                <Image src="/calender.svg" alt="logo" width={20} height={5} className=' ml-2 mr-2'/> Calender </li>
                            <li className='flex h-[40px] items-center cursor-pointer hover:bg-green1 hover:rounded-lg hover:text-white'
                                onClick={() => SetActivecomp('Timer')}>                            
                                <Image src="/watch.svg" alt="logo" width={20} height={5} className='ml-2 mr-2'/> Timer </li>
                          </ul>
                    </div>

                    <div className='flex flex-row mt-[100px] ml-[35px]'>
                          <Image src="/log.svg" alt="logo" width={20} height={5} className='mr-2'/>
                         <button>
                          <Link href="/Login" >Logout</Link>
                         </button>

                    </div>
            </div>
            <div className="flex flex-col p-[80px] w-full h-auto ">
                {rendercomp()}
            </div>
        </div>
    )
}

export default Maincontent