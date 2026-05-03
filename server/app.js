import express from "express"
import dotenv from "dotenv"
import { prisma } from "./prisma/index.js";

const app = express();
const PORT = process.env.PORT


import registerRoute from "../server/routes/auth.route.js"

app.use("/api/auth", registerRoute)

const user = await prisma.user.create({
    data: {
        name: "Kanchan Nath",
        email: "kanchan.nath.act@gmail.comn",
        password: "Kan_chan",
        grade: "UG - 1st Year"
    }
})
console.log(user);

app.listen(PORT, () => {
    console.log("Hello World");

})
export { app }