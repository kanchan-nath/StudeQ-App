import openAI from "openai"
import dotenv from "dotenv"
import fs from "fs"
import { prompt_TextExtraction } from "../prompt.js"

const openai = new openAI({
    apiKey: "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",
    baseURL: 'https://integrate.api.nvidia.com/v1'
})

const extractText = async () => {

    const base64 = fs.readFileSync("/Users/kanchannath/Coding/Spark.E/server/uploads/images/Page1.png").toString("base64")

    const response = await openai.chat.completions.create({
        model: "meta/llama-3.2-90b-vision-instruct",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: prompt_TextExtraction },
                {
                    type: "image_url",
                    image_url: { url: `data:image/png;base64,${base64}` }
                },
                
            ]
        }]
    })

    console.log(response.choices[0].message.content)
}

extractText()

export {
    extractText
}