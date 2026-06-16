import groq from "./groq.js"
import fs from "fs"
import path from "path"
import { prompt_TextExtraction } from "../prompt.js"
import logger from "../../logger/index.js"
import { fileTypeFromFile } from "file-type"
import { ApiError } from "../../utils/Async.js"

const MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct"

const safeRmDir = (folderPath)=>{
    try {
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true })
        }
    } catch (error) {
        logger.error(`safeRmDir failed for ${folderPath}:`, error.message)
    }
}

const getMimeType = async(filePath)=>{
    const { mime } = await fileTypeFromFile(filePath)

    if(!mime){
        throw new ApiError(415, "Unsupported File Type")
    }

    return mime
}
const extract = async () => {
    const folder = "/Users/kanchannath/Coding/Spark.E/server/uploads/images"
    try {

        const files = fs.readdirSync(folder).sort()
        console.log('files found:', files.length)

        const results = []
        const batchSize = 3

        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize)
            console.log(i, files.length);

            const batchResults = await Promise.all(
                batch.map(async (file) => {
                    console.log(file);

                    const imgPath = path.join(folder, file)
                    const base64 = fs.readFileSync(imgPath).toString("base64")

                    const dataURI = `data:image/jpeg;base64,${base64}`

                    const response = await groq.chat.completions.create({
                        model: "meta-llama/llama-4-scout-17b-16e-instruct",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: prompt_TextExtraction
                                    },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: `data:image/jpeg;base64,${base64}`
                                        }
                                    }
                                ]
                            }
                        ]
                    })
                    const data = response.choices[0].message.content

                    return data
                })
            )

            results.push(...batchResults)
        }
        const data = results.join('\n')
        console.log(data)
        fs.rmSync(folder, { recursive: true, force: true })
        return data

    } catch (error) {
        console.error(error.message)
        fs.rmSync(folder, { recursive: true, force: true })

    }

}

const extractTextFromImage = async(filePath, mimeType)=>{
    const base64 = fs.readFileSync(filePath).toString("base64")

    try {
        const response = await groq.chat.completions.create({
            model:"meta-llama/llama-4-scout-17b-16e-instruct",
            messages:[
                {
                    role:"user",
                    content:[
                        {
                            type:"text",
                            text:prompt_TextExtraction
                        },
                        {
                            type:"image_url",
                            image_url:{
                                url: `data:${mimeType};base64,${base64}`
                            }
                        }
                    ]
                }
            ]
        })

        const data = response.choices[0].message.content

        return data
    } catch (error) {
        console.error(error.message)
    }
}

export  {
    
    extract,
    extractTextFromImage
}