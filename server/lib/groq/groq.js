import dotenv from "dotenv"
import Groq from "groq-sdk"

dotenv.config({
    path: "/Users/kanchannath/Coding/Spark.E/server/.env"
})

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export default groq