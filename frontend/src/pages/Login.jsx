import React, { useState } from 'react'
import { Appcontext } from '../context/Appcontext';
import { useNavigate } from 'react-router-dom';
import { useContext,useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {

  const [state,setstate]=useState('Sign Up');
  const [email,setemail]=useState('')
  const [password,setpassword]=useState('')
  const [name,setname]=useState('')

  const {token,settoken,backendurl}=useContext(Appcontext)
  const navigate=useNavigate();

  const onSubmithandler = async (event) =>{
        event.preventDefault();

        try {
          if(state==='Sign Up'){
              const {data}=await axios.post(backendurl+'/api/user/register',{name,email,password})
              if(data.success){
                localStorage.setItem('token',data.token)
                settoken(data.token)
              }
              else{
                toast.error(data.message)
              }
          }
          else{
            const {data}=await axios.post(backendurl+'/api/user/login',{email,password})
              if(data.success){
                localStorage.setItem('token',data.token)
                settoken(data.token)
              }
              else{
                toast.error(data.message)
              }
          }
        } catch (error) {
          toast.error(error.message)
        }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <>
      <form  onSubmit={onSubmithandler} className='min-h-[80vh] flex items-center justify-center'>
         <div className='flex flex-col m-auto gap-3 p-8 min-w-[340px] items-start sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg' >
            <p className='text-2xl font-semibold'>{state==='Sign Up' ? "Create Account" : "Login"}</p>
            <p>PLease {state==='Sign Up' ? "Sign up" : "Log in"} to book appoinment</p>

            {
                state==='Sign Up' && <div className='w-full'>
              <p>Full Name</p>
              <input className='border border-zinc-300 w-full rounded p-2 mt-1' type="text" on onChange={(e)=>setname(e.target.value)} value={name} />
            </div>
            }

            
            <div className='w-full'>
              <p>Email</p>
              <input className='border border-zinc-300 w-full rounded p-2 mt-1' type="email" on onChange={(e)=>setemail(e.target.value)} value={email} />
            </div>
            <div className='w-full'>
              <p>Password</p>
              <input className='border border-zinc-300 w-full rounded p-2 mt-1' type="password" on onChange={(e)=>setpassword(e.target.value)} value={password} />
            </div>

            <button type='submit' className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer'>{state==='Sign Up' ? "Create Account" : "Login"}</button>
            {
              state=== "Sign Up"
              ? <p >Already have an account? <span onClick={()=>setstate('Login')} className='text-[#5f6FFF] cursor-pointer underline '>Login here</span></p>
              : <p>Create an new account? <span onClick={()=>setstate('Sign Up')} className='text-[#5f6FFF] cursor-pointer underline '>Click here</span></p>
            }

         </div>

      </form>
    </>
  )
}

export default Login
