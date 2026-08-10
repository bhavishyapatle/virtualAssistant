import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.assistantName || "")
    const [loading,setLoading]= useState(false)
    const navigate = useNavigate()

    const handleUpdateAssistant = async ()=> {
      setLoading(true)
      try {
        let formData = new FormData()
        formData.append("assistantName",assistantName)
        if(backendImage){
          formData.append("assistantImage",backendImage)
        }else{
          formData.append("imageUrl",selectedImage)
        }
        const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
        setLoading(false)

        console.log(result.data)
        setUserData(result.data)
        navigate('/')
        
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    console.log("Customize2 Rendered");
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030375] flex justify-center items-center flex-col p-[20px] relative'>
      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=> navigate("/customize")} />
        <h1 className='text-gray-300 text-[30px] text-center mb-[40px]'>Enter your <span className='text-purple-600'>Assistant Name</span></h1>
        <input type="Name" placeholder='eg. Thanos' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName} />
        {assistantName && <button className='min-w-[250px] h-[47px] bg-purple-600  rounded-full text-black font-semibold text-[19px] mt-[25px] cursor-pointer' disabled={loading} onClick={()=>{
          handleUpdateAssistant()
          }
          } >{!loading?" Create Your Assistant":"Loading..."}</button>}
        
    </div>
  )
}

export default Customize2
