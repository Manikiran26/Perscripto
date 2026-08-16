import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { Admincontext } from './context/Admincontext';
import Sidebar from './components/Sidebar';
import { Routes,Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import Allappoinment from './pages/Admin/Allappoinment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctotAppoinment from './pages/Doctor/DoctotAppoinment';
  

const App = () => {
  const {atoken}=useContext(Admincontext)
  const {dToken}=useContext(Admincontext)
  return atoken || dToken ?  (
    <div className='bg-[#F8F9FD]'>
      
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* Admin Route  */}
            <Route path='/' element={<></>}/>
            <Route path='/admin-dashboard' element={<Dashboard/>}/>
            <Route path='/all-appoinments' element={<Allappoinment/>}/>
            <Route path='/all-doctors' element={<AddDoctor/>}/>
              
            

            {/* Doctor Route  */}
            <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
            <Route path='/doctor-profile' element={<DoctorProfile/>}/>
            <Route path='/doctor-appointments' element={<DoctotAppoinment/>}/>




        </Routes>
      </div>
    </div>
  ) : <> 

   <Login/>
  <ToastContainer/>
</>
}

export default App