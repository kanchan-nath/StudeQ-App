import Groq from "groq-sdk"

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY ,
    timeout: 30_000,
    maxRetries:2
})

export default groq