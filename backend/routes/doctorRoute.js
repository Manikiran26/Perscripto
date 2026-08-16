import express from 'express'
import { doctorlist,loginDoctor,appoinmentDoctor,appoinmentcancel,appoinmentcomplete,doctorDashboard,doctorProfile,updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

const doctorRouter=express.Router();

doctorRouter.get('/list',doctorlist)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appoinments',authDoctor,appoinmentDoctor)
doctorRouter.post('/complete-appoinment',authDoctor,appoinmentcomplete)
doctorRouter.post('/cancel-appoinment',authDoctor,appoinmentcancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile)

export default doctorRouter
