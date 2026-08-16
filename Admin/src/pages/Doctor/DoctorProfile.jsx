import React, { useEffect, useState } from 'react'
import { Doctorcontext } from '../../context/Doctorcontext'
import { useContext } from 'react'
import { Admincontext } from '../../context/Admincontext'
import { Appcontext } from '../../context/Appcontex'

const DoctorProfile = () => {

    const {dToken,getProfileData,setprofileData,profileData,backendurl}=useContext(Doctorcontext)
    const {currency}=useContext(Appcontext)

    const [isEdit,setIsEdit]=useState(false)

    const updataeProfile=async()=>{

      try {
        const updatedata={
          address:profileData.address,
          fees:profileData.fees,
          available:profileData,available


        }

        const {data}=await axios.post(backendurl+'/api/doctor/update-profile',updatedata,{headers:{dToken}})

        if(data.success){
          toast.success(data.message)
          setIsEdit(false)
          getProfileData()
        }else{
          toast.error(data.error)
        }

      } catch (error) {
        toast.error(error.message)
      }

    }

    useEffect(()=>{
        if(dToken){
          getProfileData()
        }
    },[dToken])

  return profileData &&  (
    <div>
      <div className='flex flex-col gap-4 m-5 '>
        <div>
          <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />       
        </div>

        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white '>

            {/* doc info like name ,degeree ,experience */}
            <p  className='flex items-center font-medium text-3xl text-gray-700 gap-2 '>
              {profileData.name}
            </p>
            <div className=' flex items-center gap-2 mt-1 text-gray-600  '>
              <p>{profileData.degree}-{profileData.specilaity}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full '>{profileData.experience}</button>

            </div>

            {/* doc about */}

            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3 '>About:</p>

              <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                {profileData.about}
              </p>
            </div>

            <p className='text-gray-600  font-medium mt-4 '>Appointment Fee: <span className='text-gray-800'>{currency} { isEdit ? <input type='number' onChange={(e)=>setprofileData(prev=>({...prev,fees:e.target.value}))} value={profileData.fees}/> : profileData.fees}</span></p>

            <div className='flex gap-2 py-2'>
              <p>Address:</p>

              <p className='text-sm '>
              {isEdit ? <input type='text' onChange={(e)=>setprofileData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))}value={profileData.address.line1} /> :profileData.address.line1}
              <br></br>
                            {isEdit ? <input type='text' onChange={(e)=>setprofileData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}value={profileData.address.line2} /> :profileData.address.line2}
                </p>
            </div>

            <div className='flex gap-1 pt-2 '>
              <input onChange={()=>isEdit && setprofileData(prev=>({...prev,available:!prev.available}))} checked={profileData.available} type='checkbox' name="" id='' />
              <label htmlFor="">Available</label>
            </div>


              {
                isEdit ? 
                <button onClick={()=>updataeProfile()} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary transition-all hover:text-white'>Save</button>
                :

                  <button onClick={()=>setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary transition-all hover:text-white'>Edit</button>

              }


        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
