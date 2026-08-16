import { createContext } from "react";

import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import {toast} from "react-toastify";


export const Appcontext=createContext();

const Appcontextprovider=(props)=>{

    const backendurl=import.meta.env.VITE_BACKEND_URL
    const [doctors,setdoctors]=useState([])
    const [token,settoken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const currencySymbol='$';
    
    const [userData,setuserData]=useState(false)

    const getDoctordata= async ()=>{
        try {
            const {data}=await axios.get(backendurl+'/api/doctor/list')
            if(data.success){
                setdoctors(data.doctors)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loaduserProfiledata =async()=>{
        try {
            const {data}=await axios.get(backendurl+'/api/user/get-profile',{headers:{token}})
            if(data.success){
                setuserData(data.userdata)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value={
        doctors,
        getDoctordata,
        getDoctorsdata: getDoctordata,
        currencySymbol,
        token,
        settoken,
        backendurl,
        userData,
        setuserData,
        setUserData: setuserData,
        loaduserProfiledata
    }

    useEffect(()=>{
        getDoctordata()
    },[])

    useEffect(()=>{
        if(token){
            loaduserProfiledata()
        }else{
            setuserData(false)
        }
    },[token])

    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    )
}
export default Appcontextprovider       