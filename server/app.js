import "dotenv/config";
import express from "express"
import prisma from "./lib/prisma.js"
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser());
app.use(cors())

import registerRoute from "../server/routes/auth.route.js"
import userRoute from "../server/routes/auth.route.js"
import noteRoute from "./routes/note.route.js"

app.use("/api/auth", registerRoute)
app.use("/api/user", userRoute)
app.use("/api", noteRoute)

export { app }