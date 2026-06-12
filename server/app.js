import dotenv from "dotenv";
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
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser());
app.use(cors())
app.use(limiter)
app.use(helmet())

import registerRoute from "./routes/auth.route.js"
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

logger.info("Hello world X  ")
logger.warn("Hello world X  ")
logger.debug("Hello world X  ")


app.use("/api/auth", registerRoute)
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
export { app }