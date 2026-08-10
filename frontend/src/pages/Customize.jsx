import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.jpg"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image3.jpg"
import image4 from "../assets/image4.jpg"
import image5 from "../assets/image5.jpg"
import image6 from "../assets/image6.jpg"
import image7 from "../assets/image7.jpg"
import { RiImageAddLine } from "react-icons/ri";
import { MdKeyboardBackspace } from "react-icons/md";
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

function Customize() {
    
    const {serverUrl,userData, setUserData,backendImage, setBackendImage,frontendImage, setFrontendImage,selectedImage, setSelectedImage} = useContext(userDataContext)
    const navigate = useNavigate()

    const inputImage = useRef()
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030375] flex justify-center items-center flex-col p-[20px]'>
            <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=> navigate("/")} />
        <h1 className='text-gray-300 text-[30px] text-center mb-[40px]'>Select your <span className='text-purple-600'>Assistant Image</span></h1>
      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]' >
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image7} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <div className={`w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] bg-[#030329] border-2 border-[#0000ffa3] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 cursor-pointer hover:border-3 hover:border-green-200 flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-800": null}` } onClick={()=> {
          inputImage.current.click() 
          setSelectedImage("input")
          }}>
            {!frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px] '  /> }
            {frontendImage && <img src={frontendImage} className='h-full w-full object-cover ' />}   

        </div>
        <input type='file' accept='image/*' ref={inputImage} hidden onChange={handleImage} />
      </div>
      {selectedImage && <button className='min-w-[110px] h-[47px] bg-purple-600  rounded-full text-black font-semibold text-[19px] mt-[25px] cursor-pointer' onClick={()=>navigate("/customize2")} >Next</button>}
      
    </div>
  )
}

export default Customize
