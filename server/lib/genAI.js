import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"
dotenv.config(
    {
        path: "/Users/kanchannath/Coding/Spark.E/server/.env"

    }
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


export default genAI 