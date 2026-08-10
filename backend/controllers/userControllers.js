import { response } from "express"
import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/userModel.js"
import  moment from "moment"

export const getCurrentUser = async (req,res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if(!user) {
        return res.status(400).json({
            message: "user not found"
        })
        }
        return res.status(200).json(user)
    } 
    catch (error) {
        return res.status(400).json({
            message: "get current user error"
        })
    }
}

export const updateAssistant = async (req,res)=> {
    try {
        const{assistantName, imageUrl} = req.body
        let assistantImage;

        if(req.file){
            assistantImage = await uploadOnCloudinary(req.file.path)
        } else {
            assistantImage = imageUrl
        }

        const user = await User.findByIdAndUpdate(req.userId,{
            assistantName, assistantImage
        },{new:true}).select("-password")
        return res.status(200).json(user)

    } catch (error) {
        console.error("updateAssistant error:", error)   // <-- add this
        return res.status(400).json({
            message: "updateAssistantError"
        })
    }
}

// export const updateAssistant = async (req,res)=> {
//     try {
//         const{assistantName, imageUrl} = req.body
//         let assistantImage;

//         if(req.file){
//             assistantImage=await uploadOnCloudinary(req.file.path)
//         }else{
//             assistantImage=imageUrl
//         }

//         const user=await User.findByIdAndUpdate(req.userId,{
//             assistantName,assistantImage
//         },{new:true}).select("-password")
//         return res.status(200).json(user)

//     } catch (error) {
//         return res.status(400).json({
//             message: "updateAssistantError"
//         })
//     }
// }

export const  askToAssistant = async (req,res) => {
    try {
        const {command} = req.body
        const user = await User.findById(req.userId);
        user.history.push(command)
        user.save()
        const userName = user.name
        const assistantName = user.assistantName
        const result = await geminiResponse(command,assistantName,userName)

        const jsonMatch= result.match(/{[\s\S]*}/)
        if(!jsonMatch){
            return res.status(400).json({response:"sorry, i can't understand"})
        }
        const gemResult = JSON.parse(jsonMatch[0])
        const type = gemResult.type

        switch(type){
            case 'get_date' :
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get_time' :
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`
                });
            case 'get_day' :
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `today is ${moment().format("dddd")}`
                });
            case 'get_month' :
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `Month is ${moment().format("MMMM")}`
                });
            case 'google_search':    
            case 'youtube_search':    
            case 'youtube_play':    
            case 'general':       
            case 'calculator_open':    
            case 'instagram_open':    
            case 'facebook_open':    
            case 'weather_show':    
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:gemResult.response,
                });

                default:
                    return res.status(400).json({
                        response : "I didn't understand that command."
                    })

        }

    } catch(error){
    console.log(error.response?.data || error);

    return res.status(
        error.response?.status || 500
    ).json({
        response:
            error.response?.data?.error?.message ||
            "Server Error"
    });
}
}