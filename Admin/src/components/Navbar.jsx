import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Admincontext } from '../context/Admincontext'
import { useNavigate } from 'react-router-dom'
import { Doctorcontext } from '../context/Doctorcontext'

const Navbar = () => {

    const {atoken,setAtoken}=useContext(Admincontext)
    const [dToken,setDToken]=useContext(Doctorcontext)
    const navigate=useNavigate()

    const logout=()=>{
        navigate('/')
        atoken && setAtoken('')
        atoken && localStorage.removeItem('aToken')
        dToken&&setDToken('')
        dToken&&localStorage.removeItem('')
    }

  return (
    <div className=' flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white  '>
        <div className='flex items-center gap-2 text-xs'>
            <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
            <p className='border px-2.5 py-0.5 rounded-full border-gray text-gray-600'>{atoken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar