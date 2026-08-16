import doctorModel from "../models/doctormodel.js"
import appoinmentModel from "../models/Appoinmentmodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import e from "express"


const changeavailability=async(req,res)=>{
    try {
        const {docId}=req.body
        
        const docData=await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:'Availability changed'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const doctorlist = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api for doctor login

const loginDoctor=async(req,res)=>{

    try{

        const {email,password}=req.body

        const doctor=await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success:false,message:"Invalid credentials"})
        }
        const isMatch=await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token= jwt.sign({id:doctor._id},process.env.JWT_SECRET)

            res.json({success:true,message:"Login succesfull",token:token})
        }else{
            return res.json({success:false,message:"Invalid credentials"})
        }

    }catch(error){
         console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// Api to get doctor appoinments for doctor panel 

const appoinmentDoctor=async(req,res)=>{
    try{
            const {docId}=req.body
            const appoinments=await appoinmentModel.find({docId})
            res.json({success:true,appoinments})

     }
    catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to mark appoinment completed for doctor panel

const appoinmentcomplete = async(req,res)=>{
     try{
           const {docId,appoinmentId}=req.body
            const appoinmentData=appoinmentModel.findById(appoinmentId)

            if(appoinmentData && appoinmentData.docId===docId){
                await appoinmentModel.findByIdAndUpdate(appoinmentId,{isCompleted:true})
                res.json({success:true,message:"Appoinment completed"})
            }else{
                res.json({success:false,message:"mark failed"})
            }

     }
    catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to mark cancel appoinment  for doctor panel

const appoinmentcancel = async(req,res)=>{
     try{
           const {docId,appoinmentId}=req.body
            const appoinmentData=appoinmentModel.findById(appoinmentId)

            if(appoinmentData && appoinmentData.docId===docId){
                await appoinmentModel.findByIdAndUpdate(appoinmentId,{cancelled:true})
                res.json({success:true,message:"Appoinment cancelled"})
            }else{
                res.json({success:false,message:"cencelletion  failed"})
            }

     }
    catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// api to get dashboard data for doctor panel


const doctorDashboard =async(req,res)=>{
    try {
        const {docId}=req.body
        const appoinments=await  appoinmentModel.find({docId})

        let earnings=0

        appoinments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount
            }

        })

        let patients=[]

        appoinments.map((item)=>{

            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }


        })

        const dashData={
            earnings,
            appoinments:appoinments.length(),
            patients:patients.length(),
            latestAppoinments:appoinments.reverse().slice(0,5)

        }

        res.json({success:true,dashData})

    } catch (error) {
         console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to get doctor profile for doctor panel

const doctorProfile =async(req,res)=>{
    try {

        const {docId}=req.body
        const profileData=await docotorModel.findById(docId).select('-password')
        res.json({success:true,profileData})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to update doctor profile from doctor panel


const updateDoctorProfile=async(req,res)=>{

    try {
            const {docId,fees,address,available}=req.body
            await doctorModel.findByIdAndUpdate(docId,{fees,address,available})

            res.json({success:true,message:"Profile updated",})

        
    } catch (error) {
         console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export {changeavailability,doctorlist,loginDoctor,appoinmentDoctor,appoinmentcancel,appoinmentcomplete,doctorDashboard,doctorProfile,updateDoctorProfile}
