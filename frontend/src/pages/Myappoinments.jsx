import React, { useContext, useEffect, useState } from 'react'
import { Appcontext } from '../context/Appcontext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Myappoinments = () => {

  const navigate = useNavigate();
  const {backendurl, token,getDoctorsdata }=useContext(Appcontext)

  const [appoinments,setAppoinments]=useState([])

  const months=['','Jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

  const slotDateformat=(slotDate)=>{

    const dateArray=slotDate.split('_')
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2]
  }

  const getUserAppoinments=async()=>{

    try {
      
      const {data}=await axios.get(backendurl+'/api/user/appoinments',{headers:{token}})
  
      if(data.success){
        setAppoinments(data.appoinments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    
  }


  const cancelAppoinment=async(appoinmentId)=>{
    try {
      const {data}=await axios.post(backendurl+'/api/user/cancel-appoinment',{appoinmentId}, {headers:{token}})

      if(data.success){
        toast.success(data.message)
        getUserAppoinments()
        getDoctorsdata()
      }

    } catch (error) {
      toast.error(error.response.data.message)
    }

  }

  useEffect(()=>{
    if(token){
      getUserAppoinments()
    }
  },[token])


  const initpay=(order)=>{
    if(!window.Razorpay){
      return toast.error('Razorpay checkout failed to load')
    }

    const option={
      key:import.meta.env.VITE_RAZORPAY_ID,
      amount:order.amount,
      currency:order.currency,
      name:"Appoinment Payment",
      description:"Appoinment payment",  
      order_id:order.id,
      receipt:order.receipt,
      handler:async(response)=>{
        try {
          const {data}=await axios.post(backendurl+'/api/user/verifyrazorpaypayment',response,{headers:{token}})

          if(data.success){
            toast.success(data.message)
            getUserAppoinments()
            navigate('/myappoinments')
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.response?.data?.message || error.message)
        }
      },
      theme:{
        color:'#5f6FFF'
      },
      modal:{
        ondismiss:()=>{
          toast.info('Payment cancelled')
        }
      }
    }

    const rzp=new window.Razorpay(option)
    rzp.on('payment.failed',(response)=>{
      toast.error(response.error?.description || 'Payment failed')
    })
    rzp.open()
  }

  const appoimentrazorpay=async(appoinmentId)=>{
    try{
        const {data}=await axios.post(backendurl+'/api/user/payment-razorpay',{appoinmentId},{headers:{token}})

        if(data.success){
          initpay(data.order)
        }else{
          toast.error(data.message)
        }

    }catch(error){
      toast.error(error.response?.data?.message || error.message)
    }
  }



  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appoinments</p>
      <div className=''>
          {appoinments.map((item,index)=>(
              <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                  <div>
                    <img className='w-32 bg-indigo-50 ' src={item.docData.image} alt="" />
                  </div>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-neutral-700 font-semibold '>{item.docData.name}</p>
                    <p>{item.docData.speciality}</p>
                    <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                    <p className='text-xs'>{item.docData.address.line1}</p>
                    <p className='text-xs'>{item.docData.address.line2}</p>
                    <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium' >Date & Time:</span>{slotDateformat(item.slotDate)} | {item.slotTime} </p>
                  </div>
                  <div></div>
                  <div className='flex flex-col justify-end'>
                    {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>appoimentrazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-md mb-2  hover:bg-[#5f6FFF] hover:text-white transition-all duration-300'>Pay Online</button>}
                    {!item.cancelled && item.payment && !item.isCompleted &&<button className='text-sm text-green-500 text-center sm:min-w-48 py-2 border border-green-500 rounded-md mb-2'>Paid</button>}
                    {!item.cancelled &&!item.isCompleted && <button onClick={()=>cancelAppoinment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-md hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appoinment</button>}
                    {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 '>Appoinment cancelled</button>}
                    {
                      item.isCompleted &&  <button className='sm:min-w-48 border border-green-500 rounded text-green-500 '>Completed</button>
                    }
                  </div>
              </div>

          ))}
      </div>
    </div>
  )
}

export default Myappoinments
