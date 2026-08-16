import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Admincontext } from '../../context/Admincontext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const [docimg,setdocimg]=useState(false)
    const [name,setname]=useState('')
    const [email,setemail]=useState('')
    const [password,setpassword]=useState('');
    const [experence,setexperence]=useState('1 year')
    const [fee,setfee]=useState('')
    const [speciality,setspeciality]=useState('General Physician')
    const [address1,setaddress1]=useState('')
    const [address2,setaddress2]=useState('');
    const [education,seteducation]=useState('')
    const [degree,setdegree]=useState('')
    const [about,setabout]=useState('')

    const {backendurl,atoken}=useContext(Admincontext)
    
    const onSubmitHandler = async (event)=>{
        event.preventDefault()

        try {
          if(!docimg){
            return toast.error("Image not selected")
          }

          const formData = new FormData()

          formData.append('image', docimg)
          formData.append('name', name)
          formData.append('email', email)
          formData.append('password', password)
          formData.append('experience', experence)
          formData.append('fees', Number(fee))
          formData.append('speciality', speciality)
          formData.append('degree', education || degree)
          formData.append('about', about)
          formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

          const { data } = await axios.post(backendurl + '/api/admin/add-doctor', formData, { headers: { atoken } })

          if (data.success) {
            toast.success(data.message)
            setdocimg(false)
            setname('')
            setemail('')
            setpassword('')
            setfee('')
            setabout('')
            setaddress1('')
            setaddress2('')
            seteducation('')
          } else {
            toast.error(data.message)
          }

        } catch (error) {
          toast.error(error.message)
          console.error(error)
        }
    }

    

   
  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>

      <p className='mb-3 text-lg font-medium '>Add Doctor</p>
      <div className='bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll hide-scrollbar'>
        <div className=' flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
              <img className='w-16 rounded-full cursor-pointer bg-gray-100' src={ docimg ? URL.createObjectURL(docimg) : assets.upload_area} alt="" />

          </label>
          <input onChange={(e)=>setdocimg(e.target.files[0])} type="file" id='doc-img' hidden />
          <p>upload doctor <br/> picture </p>
        </div>
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600 '>
          <div className='w-full  flex flex-col lg:flex-1 gap-4 '>
            <div className='flex-1 flex flex-col gap-1'>
              <p> Doctor Name</p>
              <input onChange={(e)=>setname(e.target.value)}  value={name} className='border border-[#DADADA] rounded px-3 py-2 ' type="text" placeholder='Name' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={(e)=>setemail(e.target.value)}  value={email} className='border border-[#DADADA] rounded px-3 py-2 ' type="email" placeholder='Email' required />
            </div>

             <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input onChange={(e)=>setpassword(e.target.value)}  value={password} className='border border-[#DADADA] rounded px-3 py-2 ' type="password" placeholder='Password' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e)=>setexperence(e.target.value)}  value={experence} className='border border-[#DADADA] rounded px-3 py-2 ' name='' id=''>
                <option value="1 year">1 Year</option>
                <option value="2 year">2 Year</option>
                <option value="3 year">3 Year</option>
                <option value="4 year">4 Year</option>
                <option value="5 year">5 Year</option>
                <option value="6 year">6 Year</option>
                <option value="7 year">7 Year</option>
                <option value="8 year">8 Year</option>
                <option value="9 year">9 Year</option>
                <option value="10 year">10 Year</option>
              </select>
            </div>

             <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor fee</p>
              <input onChange={(e)=>setfee(e.target.value)}  value={fee} className='border border-[#DADADA] rounded px-3 py-2 ' type="number" placeholder='fees' required />
            </div>

          </div>
          <div className='w-full  flex flex-col lg:flex-1  gap-4  '>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e)=>setspeciality(e.target.value)}  value={speciality} className='border border-[#DADADA] rounded px-3 py-2 ' name='' id=''>

                <option value="General Physician">General Physician</option>
               
                <option value="Gynaecologist">Gynaecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
               
                <option value="Neurologist">Neurologist</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(e)=>seteducation(e.target.value)}  value={education} className='border border-[#DADADA] rounded px-3 py-2 ' type="text" placeholder='Education' required />
            </div>

             <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(e)=>setaddress1(e.target.value)}  value={address1} className='border border-[#DADADA] rounded px-3 py-2 ' type="text" placeholder='Address 1' required />
              <input onChange={(e)=>setaddress2(e.target.value)}  value={address2} className='border border-[#DADADA] rounded px-3 py-2 ' type="text" placeholder='Address 2' required /> 
            </div>

          </div>
        </div>

        <div>
          <p className='mt-4 mb-2 text-gray-500 text-lg font-medium'>About Doctor </p>
          <textarea onChange={(e)=>setabout(e.target.value)}  value={about} className='w-full px-4 pt-2 border border-[#DADADA] rounded  '  placeholder='Write About Doctor' rows={5} required />
        </div>

        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>Add doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor