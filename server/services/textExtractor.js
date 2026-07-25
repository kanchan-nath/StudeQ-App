import { ApiError } from "../utils/Async.js"
// import PDFParse from "pdf-parse/lib/pdf-parse.js";
const PDFParse = true
import fs from "fs"
import XLSX from "xlsx"
import Tesseract from "tesseract.js"
import chunking from "./chunking.js"
import embedText from "./embedText.js"
import { extract, extractTextFromImage } from "../lib/groq/extractText.js"
import pdfToImages from "./pdfToImages.js"
import { fileTypeFromBuffer } from "file-type"
import logger from "../logger/index.js"

const isFile = async (buffer) => {
    return await fileTypeFromBuffer(buffer)
}

const cleanExtractedText = (text) => {
    return text
        // page markers
        .replace(/--\s*\d+\s*of\s*\d+\s*--/g, '')
        // unicode math symbols
        .replace(/[²³°±×÷√∑∫∞≤≥≠αβγδεζηθλμπσφψω↑↓→←⟶⟹]/g, '')
        // filter lines that are mostly math garbage
        .split('\n')
        .filter(line => {
            const tokens = line.trim().split(/\s+/).filter(Boolean)
            if (tokens.length === 0) return false
            const realWords = tokens.filter(t => /[a-zA-Z]{3,}/.test(t))
            // drop line if less than 40% tokens are real words
            return (realWords.length / tokens.length) > 0.4
        })
        .join('\n')
        // isolated 1-2 char tokens (standalone a b x 2 b2 etc)
        .replace(/(?<![^\s])[a-zA-Z0-9]{1,2}(?![^\s])/g, '')
        // collapse multiple spaces/newlines
        .replace(/\n{3,}/g, '\n\n')
        .replace(/ {2,}/g, ' ')
        .trim()
}

const safeUnlink = (filePath) => {
    try {
        fs.unlinkSync(filePath)
    } catch (error) {
        throw new Error(`File is not deleted: ${error}`)
    }
}

const textExtractor = async (file) => {
    const mimeType = file.mimetype
    const filePath = file.path
    const fileDataBuffer = fs.readFileSync(filePath)
    const fileType = await isFile(fileDataBuffer)
    console.log(fileType.ext);

    const THERESOLD_CHAR = 200
    const THERESOLD_WORD = 50

    try {
        if (mimeType == "application/pdf") {

            if (!fileType || fileType?.ext !== "pdf") {
                throw new ApiError(400, "File content does not match declared type")
            }

            const uint8Array = new Uint8Array(fileDataBuffer)
            const parser = await new PDFParse(uint8Array)

            const rawText = ((await parser.getText()).text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '').trim())

            const extractedText = cleanExtractedText(rawText)

            const charCount = extractedText.length
            const wordCount = extractedText.split(/\s+/).filter(Boolean).length
            const pageCount = parser.numPages

            const isSparse = charCount < (THERESOLD_CHAR * pageCount) ||
                wordCount < (THERESOLD_WORD * pageCount)

            if (isSparse) {
                    const outputDir = process.env.PDF_IMAGES_DIR ||
                        path.join(process.cwd(), "uploads", "images")

                        if(!fs.existsSync(outputDir)){
                            fs.mkdirSync(outputDir, {recursive: true})
                        }

                    await pdfToImages(filePath, pageCount, outputDir)

                    const results = await extract(outputDir)
                    safeUnlink(filePath)
                    logger.info("Text Extracted from Pdf -> Images");

                    return results

            } 
            
            safeUnlink(filePath)

            return extractedText

        } else if (mimeType == "application/vnd.ms-excel" || mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            const wrokbook = XLSX.readFile(filePath)
            const sheet = wrokbook.Sheets[wrokbook.SheetNames[0]]

            const result = XLSX.utils.sheet_to_json(sheet)
            safeUnlink(filePath)
            return JSON.stringify(result)

        } else if ((["jpeg", "png", "webp", "jpg"].includes(fileType?.ext))) {

            const extractedText = await extractTextFromImage(filePath)

            safeUnlink(filePath)

            return extractedText

        } else if (mimeType == "text/plain") {
            const extractedText = fs.readFileSync(filePath, 'utf8')

            safeUnlink(filePath)

            return extractedText
        } else {
            safeUnlink(filePath)
            throw new ApiError(404, "File not supported")
        }
    } catch (error) {
        safeUnlink(filePath)

        if (error instanceof ApiError) throw error
        throw new ApiError(500, `Text extraction failed: ${error.message}`)
    }
}

export default textExtractor