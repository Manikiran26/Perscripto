import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const Doctorcontext=createContext();

const Doctorcontextprovider =(props)=>{

    const backendurl=import.meta.env.VITE_BACKEND_URL

    const [dToken,setDToken]=useState(localStorage.getItem('dToken') || localStorage.getItem('dToken') || '')
    const [appoinments,setAppointments]=useState([])
    const [dashData,getdashData]=useState(false)
    const [profileData,setprofileData]=useState(false)

    const getAppointments=async()=>{
        try{

            const {data}=await axios.get(backendurl+'/api/doctor/appointments',{headers:{dToken}})
            if(data.success){
                setAppointments(data.appoinments.reverse())
                console.log("Appointments fetched successfully:", data.appoinments)
            } else{
                toast.error(data.message)

            }

        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeAppoinment=async(appoinmentId)=>{
        try {
            
            const {data}=await axios.post(backendurl+'/api/doctor/complete-appoinment',{appoinmentId},{headers:{dToken}})
            if(data.success){
                toast.success(data.message)
                getAppointments()

            }
            else{
                toast.error(data.message)
            }



        } catch (error) {
             console.log(error)
            toast.error(error.message)
            
        }
    }

    const cancelAppoinment=async(appoinmentId)=>{
        try {
            
            const {data}=await axios.post(backendurl+'/api/doctor/cancel-appoinment',{appoinmentId},{headers:{dToken}})
            if(data.success){
                toast.success(data.message)
                getAppointments()

            }
            else{
                toast.error(data.message)
            }



        } catch (error) {
             console.log(error)
            toast.error(error.message)
            
        }
    }

    const getDashdata=async()=>{
        try {
            const {data}=await axios.get(backendurl+'/api/doctor/dashboard',{headers:{dToken}})
            if(data.success){
                setdashData(data.dashData)
                console.log(data.dashData)
            }else{
                toast.error(data.message)
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getProfileData=async()=>{
        try {
            
                const {data}=await axios.post(backendurl+'/api/doctor/profile',{headers:{dToken}})
                setprofileData(data.profileData)
                console.log(data.profileData)


        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value={
        backendurl,
        dToken,
        setDToken,
        appoinments,
        getAppointments,
        setAppointments,
        completeAppoinment,
        cancelAppoinment,
        dashData,setdashData,getDashdata,
        getProfileData,setprofileData,profileData,
    }

    return(
        <Doctorcontext.Provider value={value}>
            {props.children}
        </Doctorcontext.Provider>
    )


}

export default Doctorcontextprovider