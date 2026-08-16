import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctormodel.js"
import userModel from "../models/userModel.js"
import appoinmentModel from "../models/Appoinmentmodel.js"
import jwt from "jsonwebtoken"

const addDoctor=async(req,res)=>{
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body
        const imageFile=req.file;

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing details"})
        }

        // checking the email address
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid Email Address"})
        }
        
        //validating strong password
        if(password.length<8){
                return res.json({success:false,message:"Please enter strong password"})
        }

        // hashing the passsword

        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt)

        // uplaoding image to cloudinary

        const imageupload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageurl=imageupload.secure_url

        const doctordata={
            name,
            email,
            image:imageurl,
            password:hashedpassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now(),


        }
        
        const newDoctor=new doctorModel(doctordata)
        await newDoctor.save();


        res.json({success:true,message:"Doctor added"})



        



    }
    catch(error){
            console.log(error)
            res.json( {success:false,message:error.message})
    }
}

const loginAdmin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASS){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,message:"Login succesfull",token:token})
        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(error){
        console.log(error)
            res.json( {success:false,message:error.message})
    }
}

// api to get all doctors

const allDoctors=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select('-password');
        res.json({success:true,message:"Doctors fatched",doctors})
    
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Api to get all appoinment list

const appoinmentAdmin=async(req,res)=>{
    try{
        const appoinments=await  appoinmentModel.find()
        res.json({success:true,appoinments}) 

    }
    catch(error){

          console.log(error)
        res.json({success:false,message:error.message})
    }
}

// api for appoinment cancellation

const Appoinmentcancel=async(req,res)=>{

    try {
        const {appoinmentId}=req.body

        const appoinmentdata=await appoinmentModel.findById(appoinmentId)

        

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

// api to get dashboard data for admin portal


const adminDashboard=async(req,res)=>{

    try{

        const doctors=await doctorModel.find({})

        const users=await userModel.find({})
        const appoinments=await appoinmentModel.find({})

        const  dashData={
            doctors:doctors.length,
            patients:users.length,
            appoiments:appoinments.length,
            latestAppoinments:appoinments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})

    }
    catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}


export {addDoctor,loginAdmin,allDoctors,appoinmentAdmin,Appoinmentcancel,adminDashboard}
