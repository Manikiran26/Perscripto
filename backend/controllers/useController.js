import validator from "validator"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/UserModel.js"
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctormodel.js"
import appoinmentModel from "../models/Appoinmentmodel.js"
import Razorpay from "razorpay"
import crypto from "crypto"

// api to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" })
        }

        // hashing the user password
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedpassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api for user login
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            return res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to get user profile data
const getprofile = async (req, res) => {
    try {
        const { userId } = req.body
        const userdata = await userModel.findById(userId).select('-password')
        res.json({ success: true, userdata })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: 'Please provide all the details' })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to book appoinment

const  bookAppoinment =async(req,res)=>{
    try {
        const {userId,docId,slotDate,slotTime}=req.body
        
        const docData= await doctorModel.findById(docId).select('-password')

        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" })
        }

        if(!docData.available){
            return res.json({ success: false, message: "Doctor not available" })
        }

        let slots_booked = docData.slots_booked || {}

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({ success: false, message: "Slot is already booked" })
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }


        const userData=await userModel.findById(userId).select('-password') 

        const docDataObj = docData.toObject()
        delete docDataObj.slots_booked

        const appoinmentsData={

            userId,
              docId,
              userData,
              docData: docDataObj,
              amount: docDataObj.fees,
              slotTime,
              slotDate,
              date:Date.now()

        }


        const newAppoinment=new appoinmentModel(appoinmentsData)
        await newAppoinment.save()

        // save new slots in docDATA

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appoinment booked successfully"})
             
    
        

    } catch (error) {
          console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to get user appoinments for frontend my appoinments page

const listAppoinment=async(req,res)=>{
    try {
        const {userId}=req.body

        const appoinments=await appoinmentModel.find({userId})
        res.json({success:true,appoinments})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to cancel appoinment

const cancelAppoinment=async(req,res)=>{

    try {
        const {userId,appoinmentId}=req.body

        const appoinmentdata=await appoinmentModel.findById(appoinmentId)

        // verfiy appoinment user

        if(appoinmentdata.userId!=userId){
            return res.json({ success: false, message: "You are not authorized to cancel this appoinment" })
        }

        // cancel appoinment

        await appoinmentModel.findByIdAndUpdate(appoinmentId,{cancelled:true})

        // remove slots from doc data

        const {docId,slotDate,slotTime}=appoinmentdata

        const doctordata=await doctorModel.findById(docId)

        let slots_booked=doctordata.slots_booked

        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appoinment cancelled successfully"})

        



       


    } catch (error) {
         console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// api to make payment for appoinment using razorpay

const paymentrazorpay=async(req,res)=>{

    try{
        const {userId,appoinmentId}=req.body

        const appoinmentdata=await appoinmentModel.findById(appoinmentId)

        if(!appoinmentdata || appoinmentdata.cancelled){
            return res.json({ success: false, message: "Appoinment not found" })
        }

        if(appoinmentdata.userId !== userId){
            return res.json({ success: false, message: "You are not authorized to pay for this appoinment" })
        }

        if(appoinmentdata.payment){
            return res.json({ success: false, message: "Appoinment already paid" })
        }

        // creating oprions for razorpay order
        const options={
            amount: appoinmentdata.amount*100,
            currency: process.env.CURRENCY || 'INR',
            receipt: appoinmentId
        }

        // creation of order in razorpay

        const order=await razorpayInstance.orders.create(options)
        res.json({success:true,order})
    }
    catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }

   

}

// api to verify payment of razorpay

const verifyRazorpayPayment=async(req,res)=>{
    try{
        const {userId,razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body

        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
            return res.json({success:false,message:"Payment verification failed"})
        }

        const orderinfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        const appoinmentdata=await appoinmentModel.findById(orderinfo.receipt)

        if(!appoinmentdata || appoinmentdata.userId !== userId){
            return res.json({success:false,message:"Appoinment not found"})
        }

        const generatedSignature=crypto
            .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if(generatedSignature !== razorpay_signature){
            return res.json({success:false,message:"Payment verification failed"})
        }

        if(orderinfo.status==="paid"){
            await appoinmentModel.findByIdAndUpdate(orderinfo.receipt,{payment:true}) 
            return res.json({success:true,message:"Payment successful"})
        }
        console.log(orderinfo)

        res.json({success:false,message:"Payment failed"})

    }
    catch(error){
         console.log(error)
        res.json({ success: false, message: error.message })

    }
}


export {registerUser,loginuser,getprofile,updateProfile,bookAppoinment,listAppoinment,cancelAppoinment,paymentrazorpay,verifyRazorpayPayment}
