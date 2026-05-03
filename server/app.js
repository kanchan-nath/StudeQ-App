import express from "express"
import dotenv from "dotenv"
import { prisma } from "./prisma/index.js";

const app = express();

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Hello World");

})
export { app }