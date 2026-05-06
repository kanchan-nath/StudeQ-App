import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"
dotenv.config(
    {
        path: "/Users/kanchannath/Coding/Spark.E/server/.env"

    }
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

console.log(genAI);

const geminiClient = () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"})
}

export { geminiClient }