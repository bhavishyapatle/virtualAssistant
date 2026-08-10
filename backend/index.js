import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/userRoutes.js"


const app = express()
app.use(cors({
    origin: "https://virtualassistant-ipih.onrender.com",
    credentials: true
}))
const port = process.env.PORT  || 5000

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.listen(port, ()=> {
    connectDB();
    console.log('Server Started')
})
