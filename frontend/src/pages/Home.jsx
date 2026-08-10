import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import {useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CgMenuRight } from "react-icons/cg";
import { GiSkullCrossedBones } from "react-icons/gi";
import aiImg from '../assets/voice.gif'
import userImg from '../assets/user.gif'

function Home() {
  const  {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening,setListening] = useState(false)
  const [userText,setUserText] = useState('')
  const [aiText,setAiText] = useState('')
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham,setHam] = useState(false)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogOut = async ()=> {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        setUserData(null)
        navigate('/signin')
      } catch (error) {
        setUserData(null)
        console.log(error)
    }
  }

  const startRecognition = () => {

    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start")
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  }

  const speak=(text)=>{
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if(hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current=true
    utterance.onend=()=> {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition();
      }, 800);
    }
      synth.cancel();
      synth.speak(utterance);
  }

  const handleCommand = (data) => {
    const {type,userInput,response} = data
    speak(response);

    if (type === 'google_search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    }
    if (type === 'calculator_open') {
      window.open(`https://www.google.com/search?q=calculator`,'_blank');
    }
    if (type === 'instagram_open') {
      window.open(`https://www.instagram.com/`,'_blank');
    }
    if (type === 'faceook_open') {
      window.open(`https://www.facebook.com/`,'_blank');
    }
    if (type === 'weather_show') {
      window.open(`https://www.google.com/search?q=weather`,'_blank');
    }

    if (type === 'youtube_search' || type === 'youtube_play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');
    }
    
  }


  useEffect(()=> {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.continuous=true,
    recognition.lang='en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = ()=> {
      isRecognizingRef.current = true;
      setListening(true);
    };
    
    recognition.onend = ()=> {
      isRecognizingRef.current = false;
      setListening(false);

      if(isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recognition restarted")
            } catch (e) {
              if (e.name !== "InvalidStateError")
                console.error(e)
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event)=> {
      console.warn('Recognition error:', event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if(event.error !== 'aborted' && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recognition restarted after error")
            } catch (e) {
              if (e.name !== "InvalidStateError")
                console.error(e)
            }
          }
        }, 1000);
      }
    }
    
    recognition.onresult= async (e)=>{
      const transcript = e.results[e.results.length-1][0].transcript.trim()

      if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){

        setAiText("")
        setUserText(transcript)

        recognition.stop()
        isRecognizingRef.current=false
        setListening(false)

        const data = await getGeminiResponse(transcript);

        handleCommand(data);
        setAiText(data.response)
        setUserText("")

      }

    }

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can i help you with?`);
    greeting.lang = 'hi-IN'

    window.speechSynthesis.speak(greeting);

    return ()=> {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop()
      setListening(false)
      isRecognizingRef.current=false
    }
  },[])






  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030375] flex justify-center items-center flex-col  gap-[20px] '>
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={()=>setHam(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000022] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform `} >
      <GiSkullCrossedBones className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={()=>setHam(false)}/>
      <button className='min-w-[110px] h-[45px] text-white rounded-full border-2 border-gray-500 font-semibold text-[17px]  cursor-pointer' onClick={handleLogOut} >Log Out</button>
      <button className='min-w-[150px] h-[45px] text-white rounded-full border-2 border-gray-500 font-semibold text-[17px]  cursor-pointer px-[20px]' onClick={()=> navigate('/customize')} >Customize your Assistant</button>
      
      <div className='w-full h-[2px] bg-gray-400' ></div>
      <h1 className='text-white font-semibold text-[19px]' >History</h1>

      <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-[20px] truncate' >
        {userData.history?.map((his)=> (
          <span className='text-gray-200 text-[18px] w-full h-[30px] ' >{his}</span>
        ))}

      </div>

      </div>
      <button className='min-w-[110px] h-[45px] text-white rounded-full border-2 border-gray-500 font-semibold text-[17px] mt-[25px] absolute top-[20px] right-[40px] hidden lg:block cursor-pointer' onClick={handleLogOut} >Log Out</button>
      <button className='min-w-[150px] h-[45px] text-white rounded-full border-2 border-gray-500 font-semibold text-[17px] mt-[25px] absolute top-[20px] left-[40px] hidden lg:block cursor-pointer px-[20px]' onClick={()=> navigate('/customize')} >Customize your Assistant</button>
      <div className='w-[250px] h-[400px] flex justify-center items-center overflow-hidden rounded-xl  shadow-lg shadow-blue-300 '>
        <img src={userData?.assistantImage} alt="" className=' h-full w-full'/>
      </div>
      <h1 className='text-white font-semibold text-[18px] ' >I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-[150px]' /> }
      {aiText && <img src={aiImg} alt="" className='w-[150px]' /> }

      <h1 className='text-blue-50 text-[18px] font-semibold text-wrap' >{userText?userText:aiText? aiText:null}</h1>
    </div>
  )
}

export default Home
