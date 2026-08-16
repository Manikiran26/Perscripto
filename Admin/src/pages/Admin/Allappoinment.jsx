import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { Appcontext } from '../../context/Appcontex'
import { Admincontext } from '../../context/Admincontext'
import { assets } from '../../assets/assets'

const Allappoinment = () => {

  
  const {atoken,appoinments,getAllappoinments,cancelAppoinment}=useContext(Admincontext)

  const {calculateAge,slotDateformat,currency}=useContext(Appcontext)

  useEffect(()=>{
    if(atoken){
      getAllappoinments()
    }
  },[atoken])

  return (
    <div className='w-full m-5 max-w-6xl '>
      <p className='mb-3 text-lg  font-medium' >All appoinments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {
          appoinments.map((item,index)=>{
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-500' key={index}>
              <p className='max-sm:hidden' >{index+1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full ' src={item.userData.image} alt="Patient" /><p>{item.userData.name}</p>

              </div>

              <p className='max-sm:hidden' >{calculateAge(item.userData.dob)}</p>
              <p>{slotDateformat(item.slotDate)},{item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full bg-gray-300 ' src={item.docDataimage} alt="Doctor" /><p>{item.docData.name}</p>

              </div>
              <p>{currency}{item.amount}</p>
              {item.cancelled ? 
              <p className='text-red-500 text-xs font-medium'>Cancelled</p>
              : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={()=>cancelAppoinment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
              
              }

              
            </div>
          })
        }

      </div>
    </div >
  )
}

export default Allappoinment