import "dotenv/config";
import express from "express"
import prisma from "./lib/prisma.js"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser());


const PORT = process.env.PORT


import registerRoute from "../server/routes/auth.route.js"

app.use("/api/auth", registerRoute)

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);

})
export { app }