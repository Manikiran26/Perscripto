import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <>
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    {/* left section */}
                        <img className='mb-5 w-40' src={assets.logo} alt="" />
                        <p className='w-full md:w-2/3 text-gray-600 leading-6'>Prescripto is a modern hospital management and appointment booking platform designed to simplify healthcare access. We connect patients with trusted doctors across multiple specialities, enabling easy appointment scheduling, secure medical management, and a seamless healthcare experience. Our mission is to make quality healthcare accessible, efficient, and reliable for everyone.</p>
                </div>
                <div>
                    {/* center section */}
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact Us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div>
                {/* right section */}
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91 8106122606</li>
                        <li>manikiranreddy026@gmail.com</li>
                            
                    </ul>
                </div>
            </div>
            <div>
                
                <p className='py-5 text-sm text-center'>Copyright 2026 © Prescripto. All rights reserved.</p>
            </div>
            
        </div>
        
        
        
        
    </>
  )
}

export default Footer