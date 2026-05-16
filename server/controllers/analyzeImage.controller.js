import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import fs from "fs"
import { imageAnalyze } from "../lib/groq/imageAnalyze.js"
import textExtractor from "../services/textExtractor.js"

const analyze = asyncHandler(async (req, res) => {
    try {
        // const imageLocalFilePath = req.files?.image[0].path
        const imageLocalFilePath = req.files?.image[0]
        textExtractor(imageLocalFilePath)
        
        const mimeType = req.files?.image[0].mimetype

        const imageData = fs.readFileSync(imageLocalFilePath)
        const base64Image = imageData.toString("base64")

        const data = await imageAnalyze(fs.readFileSync(req.files.image[0].path).toString("base64"), mimeType)

        fs.unlinkSync(imageLocalFilePath)

        return res
            .status(200)
            .json(new ApiResponse(200, data, "file uploaded"))
    } finally {
        if (imageLocalFilePath && fs.existsSync(imageLocalFilePath)) {
            fs.unlinkSync(imageLocalFilePath)
        }
    }


})

export {
    analyze
}