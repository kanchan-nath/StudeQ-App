import groq from "./groq.js"
import fs from "fs"
import path from "path"
import { prompt_TextExtraction } from "../prompt.js"
import logger from "../../logger/index.js"
import { fileTypeFromFile } from "file-type"
import { ApiError } from "../../utils/Async.js"
import {logAIResponse} from "../../utils/logAIResponse.utils.js"

const MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct"

const safeRmDir = (folderPath) => {
    try {
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true })
        }
    } catch (error) {
        logger.error(`safeRmDir failed for ${folderPath}:`, error.message)
    }
}

const getMimeType = async (filePath) => {

    let result
    try {
        result = await fileTypeFromFile(filePath)

    } catch (error) {
        throw new ApiError(415, "Could not read file")
    }

    if (!result) throw new ApiError(415, "Could not read file")

    const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

    if (!ALLOWED.has(result.mime)) {
        throw new ApiError(415, "Unsupported File Type")
    }
    const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

    if (!IMAGE_EXTENSIONS.has(result.ext)) {
        throw new ApiError(415, "Unsupported File Type")
    }
    const isImageFile = (filePath) =>
        IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())

    return { result, isImageFile }
}
const extract = async (outputDir, userId) => {
    // const folder = "/Users/kanchannath/Coding/StudeQ/server/uploads/images"
    if (!outputDir) {
        throw new Error("extract: outputDir is required")
    }
    const batchSize = Number(process.env.VISION_BATCH_SIZE) || 3
    const { result, isImageFile } = await getMimeType(filePath)

    try {

        const allFiles = fs.readdirSync(outputDir).sort()

        const files = allFiles.filter(isImageFile)

        if (files.length === 0) {
            throw new Error(`extract: no image files found in ${outputDir}`)
        }

        const results = []

        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize)
            console.log(i, files.length);

            const batchResults = await Promise.all(
                batch.map(async (file) => {
                    console.log(file);

                    const imgPath = path.join(folder, file)
                    const base64 = fs.readFileSync(imgPath).toString("base64")

                    const mimeType = result.mime
                    const dataURI = `data:${mimeType};base64,${base64}`

                    let response

                    try {
                        response = await groq.chat.completions.create({
                            model: MODEL,
                            messages: [
                                {
                                    role: "system",
                                    content: prompt_TextExtraction
                                },
                                {
                                    role: "user",
                                    content: [
                                        {
                                            type: "text",
                                            text: "Extract all content from this image."
                                        },
                                        {
                                            type: "image_url",
                                            image_url: {
                                                url: dataURI
                                            }
                                        }
                                    ]
                                }
                            ],
                            max_completion_tokens: 2000,
                        })
                    } catch (error) {
                        logger.error(`Vision API failed for ${file}:`, error.message)
                        return `[OCR failed for page ${i + batch.indexOf(file) + 1}]`
                    }

                    const raw = response?.choices[0]?.message?.content
                    if (!raw) {
                        logger.warn(`Empty response for ${file}`)

                        return `[Empty response for page ${i + batch.indexOf(file) + 1}]`
                    }

                    await logAIResponse(userId, "Extract all text from the image", raw, response)

                    return raw
                })
            )

            results.push(...batchResults)

            if (i + batchSize < files.length) {
                await new Promise(r => setTimeout(r, 500))
            }
        }
        const data = results.join('\n')
        logger.info(`extract: processed ${files.length} pages, ${data.length} chars extracted`)

        safeRmDir(outputDir)
        
        return data

    } catch (error) {
        safeRmDir(outputDir)
        throw new Error(`extract failed: ${error.message}`)

    }

}

const extractTextFromImage = async (filePath, userId) => {
    if (!filePath){
        throw new Error("extractTextFromImage: filePath required")
    }

    if(!fs.existsSync(filePath)){
        throw new Error(`extractTextFromImage: file not found: ${filePath}`)
    }

    let base64

    try {
        base64 = fs.readFileSync(filePath).toString("base64")
    } catch (error) {
        throw new Error(`extractTextFromImage: failed to read file: ${error.message}`)
    }
    const mimeType = await getMimeType(filePath)
    const dataURI = `data:${mimeType};base64,${base64}`
    let response
    try {
         response = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role:"system",
                    content: prompt_TextExtraction
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Extract all content from this image."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url:dataURI
                            }
                        }
                    ]
                }
            ],
            max_completion_tokens:2000,
            temperature:0
        })

    } catch (error) {
        throw new Error(`extractTextFromImage failed: ${error.message}`)
    }
    const raw = response?.choices[0]?.message?.content

    if (!raw) {
        throw new Error("extractTextFromImage: empty response from vision model")
    }

    await logAIResponse(userId, "Extract all content from this image.", raw, response)

    return raw
}

export {

    extract,
    extractTextFromImage
}