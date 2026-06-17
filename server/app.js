import "./configs/env.js"
import express from "express"
import prisma from "./lib/prisma.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import {generalLimiter, authLimiter, aiLimiter} from "./middlewares/rateLimiter.middleware.js";
import helmet from "helmet"
import logger from "./logger/index.js"

const app = express();

app.set("trust proxy", 1)
app.use(helmet())

// const allowOrigins = (process.env.CORS_ORIGINS || "").split(",").filter(Boolean)
// app.use(cors(
//     {
//         origin: allowOrigins.length ? allowOrigins : false,
//         credentials: true
//     }
// ))
app.use(cors({
    origin: ["http://localhost:5173", "http://192.168.1.8:5173"],
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser());

import userRoute from "./routes/auth.route.js"
import noteRoute from "./routes/note.route.js"
import tutorRouter from "./routes/tutor.route.js"
import quizRouter from "./routes/quiz.route.js"
import studyRoomRouter from "./routes/studyRoom.route.js"
import imageAnalysisRouter from "./routes/imageAnalysis.route.js"
import pdfAnalysisRouter from "./routes/pdfAnalysis.route.js"
import schedulerRouter from "./routes/scheduler.route.js"
import filesRagRouter from "./routes/filesRag.route.js"
import searchAPIRouter from "./routes/searchAPI.route.js"
import healthRouter from "./routes/health.route.js"

app.use(generalLimiter)
app.use("/api/auth", userRoute)
app.use("/api/user", userRoute)
app.use("/api", noteRoute)
app.use("/api/tutor", tutorRouter)
app.use("/api/quiz", quizRouter)
app.use("/api", studyRoomRouter)
app.use("/api/image", imageAnalysisRouter)
app.use("/api/pdf", pdfAnalysisRouter)
app.use("/api", schedulerRouter)
app.use("/api/documents", filesRagRouter)
app.use("/api", searchAPIRouter)
app.use("/api/health", healthRouter)
app.use((req, res)=>{
    res.status(404)
    .json(
        {
            success:false,
            message: "Route not found"
        }
    )
})
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500

    logger.error(err)
    res.status(statusCode)
    .json(
        {
            success:false,
            message: err.message || "Internal Server Error",
            ...(process.env.NODE_ENV === "development" && {stack: err.stack})
        }
    )
})

export { app }