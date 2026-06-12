import dotenv from "dotenv";

if(!process.env.NODE_ENV){
    logger.warn("NODE_ENV not set — defaulting to development. DO NOT use in prod.")
}
dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`
});
import express from "express"
import prisma from "./lib/prisma.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import limiter from "./middlewares/rateLimiter.middleware.js";
import helmet from "helmet"
import logger from "./logger/index.js"

const app = express();

app.set("trust proxy", 1)
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser());

const allowOrigins = (process.env.CORS_ORIGINS || "").split(",").filter(Boolean)
// app.use(cors(
//     {
//         origin:allowOrigins.length ? allowOrigins : false,
//         credentials: true
//     }
// ))
app.use(cors())
app.use(limiter)
app.use(helmet())


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

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500

    logger.error(err)
    res
    .status(statusCode)
    .json(
        {
            success:false,
            message: err.message || "Internal Server Error",
            ...(process.env.NODE_ENV === "development" && {stack: err.stack})
        }
    )
})
export { app }