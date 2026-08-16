import express from 'express'
import {addDoctor,allDoctors, loginAdmin,appoinmentAdmin,Appoinmentcancel,adminDashboard} from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js'
import { changeavailability } from '../controllers/doctorController.js'


const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeavailability)
adminRouter.get('/appoinments',authAdmin,appoinmentAdmin)
adminRouter.post('/cancel-appoinments',authAdmin,Appoinmentcancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter

