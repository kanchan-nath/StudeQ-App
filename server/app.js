import express from "express"
import dotenv from "dotenv"

const app = express();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const user = await prisma.user.create({
    data: { name: "Kanchan", email: "k@test.com" }
})
const PORT = 4000
app.listen(PORT, () => {
    console.log("Hello World");

})
export { app }