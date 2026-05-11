import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import fs from "fs"
import {PDFParse} from "pdf-parse"
import { analyzePDF } from "../lib/groq/pdfAnalyze.js"

const pdfAnalyze = asyncHandler(async(req, res)=>{
    const pdfLocalFilePath = req.files?.pdf[0]?.path

    const dataBuffer = fs.readFileSync(pdfLocalFilePath)
    const uint8Array = new Uint8Array(dataBuffer)
    const parser = new PDFParse(uint8Array)
    const result = await parser.getText();

    const data  = await analyzePDF(result.text)
    console.log(result.text);
    
    return res
    .status(200)
    .json(new ApiResponse(200, {data}, "file extracted suucesfully"))
    
})

export {
    pdfAnalyze
}