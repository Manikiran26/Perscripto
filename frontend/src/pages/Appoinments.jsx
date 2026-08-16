import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Appcontext } from '../context/Appcontext';
import { assets } from '../assets/assets';
import Relateddoctors from '../components/Relateddoctors';
import { toast } from 'react-toastify';
import axios from 'axios';


const daysofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const Appoinments = () => {

  const {docid}=useParams();
  const {doctors,currencySymbol,token,backendurl,getDoctorsdata}=useContext(Appcontext)

  const [docInfo,setdocInfo]=useState(null)
  const [docSlots,setdocSlots]=useState([])
  const [slotIndex,setslotIndex]=useState(0);
  const [slotTime,setslotTime]=useState('');

  const navigate=useNavigate()

  const fetchdocinfo=async()=>{
    const docinfo=doctors.find(doc=>doc._id===docid) || null
    setdocInfo(docinfo)
    
  }

  const getAvailableslot=async()=>{
        if(!docInfo){
          setdocSlots([])
          return
        }
 
        let today=new Date()
        let slotsByDay=[]
        const bookedSlots=docInfo.slots_booked || {}

        for(let i=0;i<7;i++){
          let currentDate=new Date(today);
          currentDate.setDate(today.getDate()+i);

          let endTime=new Date();;
          endTime.setDate(today.getDate()+i);
          endTime.setHours(21,0,0,0);

          if(today.getDate()===currentDate.getDate()){
            currentDate.setHours(currentDate.getHours()>10 ? currentDate.getHours() +1:10)
            currentDate.setMinutes(currentDate.getMinutes()>30 ? 30:0)

          }else{
            currentDate.setHours(10);
            currentDate.setMinutes(0);
          }

          let timeSlots=[];
          while(currentDate<endTime){
                    let formattedTime = currentDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }); 

              let day=currentDate.getDate()
              let month=currentDate.getMonth()+1
              let year=currentDate.getFullYear()

              const slotDate=day+"_"+month+"_"+year
              const slotTime=formattedTime

              const isSlotavailable=!bookedSlots[slotDate]?.includes(slotTime)

              
              if(isSlotavailable){

                timeSlots.push({
                  datetime:new Date(currentDate),
                  time:formattedTime,
                  
                })
              }


            currentDate.setMinutes(currentDate.getMinutes()+30);
            
            
          }

          slotsByDay.push(timeSlots)
        }

        setdocSlots(slotsByDay)
        setslotIndex(0)
        setslotTime('')
  }

  const bookappoinment = async()=>{
        if(!token){
            toast.warn('Login to book appoinment')
            return navigate('/login')
        }

        if(!slotTime){
            return toast.warn('Please select a time slot')
        }

        try {
          const date=docSlots[slotIndex]?.[0]?.datetime

          if(!date){
            return toast.warn('Please select an available date')
          }

          let day=date.getDate()
          let month=date.getMonth()+1
          let year=date.getFullYear()
          
          const slotDate=day+"_"+month+"_"+year

          const {data}=await axios.post(backendurl+'/api/user/book-appoinment',{docId: docid, slotDate, slotTime},{headers:{token}})

          if(data.success){
            toast.success(data.message)
            getDoctorsdata()
            return navigate('/myappoinments')
          }
          else{
            toast.error(data.message)
          }
          
        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }
  }

  useEffect(()=>{
    fetchdocinfo()
  },[doctors,docid])

  useEffect(()=>{
    getAvailableslot()
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])

  return docInfo && (
    <div>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
          </div>

          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>

              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>
            <div className='flex -tem-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              <p>About <img src={assets.info_icon} alt="" /></p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}/-</span></p>

        </div>

        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 '>
              <p>Booking Slots</p>
              <div className='flex gap-3 items-center w-full overflow-x-scroll hide-scrollbar mt-4'>
                {
                  docSlots.length > 0 && docSlots.map((item,index)=>(
                    <div onClick={()=>{setslotIndex(index); setslotTime('')}} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-[#5f6FFF] text-white' : 'border border-gray-200'}`} key={index}>

                      <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
                      <p>{item[0] && item[0].datetime.getDate()}</p>


                    </div>
                  ))
                }

              </div>
              <div className='flex items-center gap-3 w-full overflow-x-auto hide-scrollbar mt-4'>
                {
                  docSlots[slotIndex]?.length > 0 ? docSlots[slotIndex].map((items,index)=>(
                    <p onClick={()=>setslotTime(items.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${items.time===slotTime ? 'bg-[#5f6FFF] text-white' : 'border border-gray-200'}`} key={index}>
                        {items.time.toLowerCase()}
                    </p>
                  )) : <p className='text-sm text-gray-500'>No slots available for this day</p>
                }
              </div>
              <button onClick={bookappoinment} className='bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appoinment</button>
        </div>

        <Relateddoctors docId={docid} speciality={docInfo.speciality}/>

    </div>
  )
}

export default Appoinments
