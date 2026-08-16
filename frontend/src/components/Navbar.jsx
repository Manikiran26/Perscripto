import React from 'react'
import {assets} from '../assets/assets'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {NavLink, useNavigate} from 'react-router-dom'
import { useContext } from 'react';
import { Appcontext } from '../context/Appcontext';

const Navbar = () => {

    const navigate = useNavigate();

    const [showmenu,setshowmenu]=useState(false);
    const {token,settoken,userData}=useContext(Appcontext)

    const logout=()=>{
        settoken(false)
        localStorage.removeItem('token')
    }



  return (
    <>
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>

        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/' >
                <li className='py-1'>Home</li>
                <hr className='border-none  h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='/doctors' >
                <li className='py-1'>All Doctors</li>
                <hr className='border-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
              
            </NavLink>
            <NavLink to='/about'>
                <li className='py-1'>About</li>
                <hr className='border-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1'>Contact</li>
                <hr className='border-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>
        </ul>
        <div>
            {
                token && userData
                ?<div className='flex  gap-2 cursor-pointer group relative'>

                    <img className='w-8 rounded-full' src={userData.image} alt="" />
                    <img className='w-2.5'src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-full  right-0  text-base font-medium text-gray-600 z-50 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col p-4 gap-2'>
                            <p onClick={()=>navigate('/Myprofile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('/myappoinments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                            <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                :<button onClick={()=>navigate('/login')} className='text-white bg-[#5f6FFF] font-light hidden md:block px-8 py-3 rounded-full'>
                Create account
            </button>
            }
            <img onClick={()=>setshowmenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
            <div className={`${showmenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="" />
                    <img className='w-7' onClick={()=>setshowmenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 px-5 text-lg font-medium mt-5'>
                    <NavLink  onClick={()=>setshowmenu(false)} to='/'><p className='py-2 px-4 inline-block rounded'>Home</p></NavLink>
                    <NavLink onClick={()=>setshowmenu(false)} to='/doctors'><p className='py-2 px-4 inline-block rounded'>All Doctors</p></NavLink>
                    <NavLink onClick={()=>setshowmenu(false)} to='/about'><p className='py-2 px-4 inline-block rounded'>About</p></NavLink>
                    <NavLink onClick={()=>setshowmenu(false)} to='/contact'><p className='py-2 px-4 inline-block rounded'>Contact</p></NavLink>
                </ul>
            </div>
            
        </div>
    </div>
    </>
  )
}

export default Navbar