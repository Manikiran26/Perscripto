import express from 'express'

import { registerUser,loginuser, getprofile,updateProfile,bookAppoinment,listAppoinment, cancelAppoinment,paymentrazorpay,verifyRazorpayPayment } from '../controllers/useController.js'
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';


const userRouter=express.Router();


userRouter.post('/register',registerUser)
userRouter.post('/login',loginuser)
userRouter.get('/get-profile',authUser,getprofile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)

userRouter.post('/book-appoinment',authUser,bookAppoinment)
userRouter.get('/appoinments',authUser,listAppoinment)
userRouter.post('/cancel-appoinment',authUser,cancelAppoinment)
userRouter.post('/payment-razorpay',authUser,paymentrazorpay)
userRouter.post('/verifyrazorpaypayment',authUser,verifyRazorpayPayment)


export default userRouter