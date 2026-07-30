import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import fs from "fs"
import PDFParse from "pdf-parse";
import { analyzePDF } from "../lib/groq/pdfAnalyze.js"

const pdfAnalyze = asyncHandler(async (req, res) => {
    try {
        const pdfLocalFilePath = req.files?.pdf?.[0]?.path
        if (!pdfLocalFilePath) throw new ApiError(400, "No PDF uploaded")

        const dataBuffer = fs.readFileSync(pdfLocalFilePath)
        const uint8Array = new Uint8Array(dataBuffer)
        const result = await pdfParse(uint8Array)

        const data = await analyzePDF(result.text)

        fs.unlinkSync(pdfLocalFilePath)

        return res
            .status(200)
            .json(new ApiResponse(200, data, "file extracted suucesfully"))
    } finally {
        if (pdfLocalFilePath && fs.existsSync(pdfLocalFilePath)) {
            fs.unlinkSync(pdfLocalFilePath)
        }
    }


})

export {
    pdfAnalyze
}