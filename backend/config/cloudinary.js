import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath)
        return uploadResult.secure_url
    }
    catch (error) {
        console.error("Cloudinary upload error:", error)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath) // clean up even on failure
        }
        throw error // let the caller handle it, don't reference res here
    }      
}

export default uploadOnCloudinary

// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs'

// const uploadOnCloudinary = async (filePath) => {
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     });

//     try {
//         const uploadResult = await cloudinary.uploader
//        .upload(filePath)
//        fs.unlinkSync(filePath)
//        return uploadResult.secure_url
//     }
//     catch (error) {
//         return res.status(500).json({
//             message:'cloudinary error'
//         })
//     }      
// }

// export default uploadOnCloudinary