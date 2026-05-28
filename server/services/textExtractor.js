import { ApiError } from "../utils/Async.js"
import { PDFParse } from "pdf-parse"
import fs from "fs"
import XLSX from "xlsx"
import Tesseract from "tesseract.js"
import chunking from "./chunking.js"
import embedText from "./embedText.js"
import extract from "../lib/groq/extractText.js"
import pdfToImages from "./pdfToImages.js"

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

const textExtractor = async (file) => {
    const mimeType = file.mimetype
    const filePath = file.path

    const fileDataBuffer = fs.readFileSync(filePath)
    const base64File = fileDataBuffer.toString('base64')

    const THERESOLD_CHAR = 100
    const THERESOLD_WORD = 70

    try {
        if (mimeType == "application/pdf") {
            const uint8Array = new Uint8Array(fileDataBuffer)
            const parser = await new PDFParse(uint8Array)

            const text = ((await parser.getText()).text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '').trim())

            const extractedText = cleanExtractedText(text)

            // console.log(extractedText);
            
            const charCount = extractedText.length
            const wordCount = extractedText.split(/\s+/).filter(Boolean).length
            const pageCount = parser.doc._pdfInfo.numPages

            if (charCount < (THERESOLD_CHAR * pageCount) || wordCount < (THERESOLD_WORD * pageCount)) {

                try {
                    await pdfToImages(filePath, pageCount)

                    // console.log(results);
                    const results = await extract()
                    console.log(results);
                    
                    
                } catch (error) {
                    console.error(error);
                    fs.unlinkSync(filePath)
                }finally{
                    // fs.unlinkSync(filePath)
                }

            } else {

                embedText(extractedText)
                fs.unlinkSync(filePath)
                return extractedText
            }

        } else if (mimeType == "application/vnd.ms-excel") {
            const wrokbook = XLSX.readFile(filePath)
            const sheet = wrokbook.Sheets[wrokbook.SheetNames[0]]

            const result = XLSX.utils.sheet_to_json(sheet)
            const extractedText = JSON.stringify(result)

            fs.unlinkSync(filePath)
            return extractedText

        } else if ((["image/jpeg", "image/png", "image/webp"].includes(mimeType))) {
            const dataBuffer = fs.readFileSync(filePath)

            const { data } = await Tesseract.recognize(filePath, "eng")
            const extractedText = data.text

            fs.unlinkSync(filePath)
            return extractedText

        } else if (mimeType == "text/plain") {
            const extractedText = fs.readFileSync(filePath, 'utf8')

            fs.unlinkSync(filePath)
            return extractedText
        } else {
            throw new ApiError(404, "File not supported")
            fs.unlinkSync(filePath)
        }
    } catch (error) {
        console.error("Text extractiobn error", error)
        fs.unlinkSync(filePath)

    }
}

export default textExtractor