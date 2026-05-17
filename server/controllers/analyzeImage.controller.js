import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import fs from "fs"
import { imageAnalyze } from "../lib/groq/imageAnalyze.js"

const analyze = asyncHandler(async (req, res) => {
    try {
        const imageFile = req.files?.image?.[0].path

        if (!imageFile) {
            throw new ApiError(400, "No image file uploaded")
        }

        const mimeType = imageFile.mimetype
        const imageData = fs.readFileSync(imageFile.path)
        const base64Image = imageData.toString("base64")

        const data = await imageAnalyze(base64Image, mimeType)

        return res
            .status(200)
            .json(new ApiResponse(200, data, "file uploaded"))
    } finally {
        if (imageFile?.path && fs.existsSync(imageFile.path)) {
            fs.unlinkSync(imageFile.path)
        }
    }


})

export {
    analyze
}