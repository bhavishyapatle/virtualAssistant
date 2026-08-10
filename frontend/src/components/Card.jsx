import React, { useContext } from 'react'
import { userDataContext } from '../context/userContext'

function Card({image}) {
    const {serverUrl,userData, setUserData,backendImage, setBackendImage,frontendImage, setFrontendImage,selectedImage, setSelectedImage} = useContext(userDataContext)
  return (
    <div className={`w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] bg-[#030329] border-2 border-[#0000ffa3] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 cursor-pointer hover:border-3 hover:border-green-200 ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-800": null} `} onClick={()=> {
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
      }} >
      <img src={image} className='h-full w-full object-cover' />
    </div>
  )
}

export default Card
