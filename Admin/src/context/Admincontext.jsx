import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const Admincontext=createContext();

const Admincontextprovider =(props)=>{

    const [atoken,setAtoken]=useState(localStorage.getItem('aToken') || localStorage.getItem('atoken') || '');
    const backendurl=import.meta.env.VITE_BACKEND_URL
    const [doctors,setdoctors]=useState([])
    const [appoinments,setAppoinments]=useState([])
    const [dashData,setDashData]=useState(false)


    const getAllDoctors=async()=>{
        try {
            const {data}=await axios.post(backendurl+'/api/admin/all-doctors',{},{headers:{atoken}});
            if(data.success){
                setdoctors(data.doctors);
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability= async (docId)=>{
        try {
            const {data}=await axios.post(backendurl+'/api/admin/change-availability',{docId},{headers:{atoken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllappoinments=async()=>{
        try{

            const {data}=await axios.get(backendurl+'/api/admin/appoinments',{headers:{atoken}})
            if(data.success){
                setAppoinments(data.appoinments)
                console.log(data.appoinments)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    const cancelAppoinment=async(appoinmentId)=>{
        try{
            const {data}=await axios.post(backendurl+'/api/admin/cancel-appoinments',{appoinmentId},{headers:{atoken}})
            if(data.success){
                toast.success(data.message)
                getAllappoinments()
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){

        }
    }

    const getDashdata=async()=>{
        try{
            
            const {data}=await axios.get(backendurl+'/api/admin/dashboard',{headers:{atoken}})

            if(data.success){
                setDashData(data.dashData)
            }

        }
        catch(error){
             toast.error(data.message)
        }
    }

    const value={
        atoken,
        setAtoken,
        backendurl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appoinments,setAppoinments,
        getAllappoinments,
        cancelAppoinment,
        dashData,
        getDashdata

    }

    return(
        <Admincontext.Provider value={value}>
            {props.children}
        </Admincontext.Provider>
    )


}

export default Admincontextprovider