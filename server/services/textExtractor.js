import { ApiError } from "../utils/Async.js"
import { PDFParse } from "pdf-parse"
import fs from "fs"
import XLSX from "xlsx"
import Tesseract from "tesseract.js"
import chunking from "./chunking.js"
import embedText from "./embedText.js"

const textExtractor = async (file) => {
    const mimeType = file.mimetype
    const filePath = file.path

    try {
        if (mimeType == "application/pdf") {
            const dataBuffer = fs.readFileSync(file.path)
            const uint8Array = new Uint8Array(dataBuffer)
            const parser = new PDFParse(uint8Array)
            const extractedText = (await parser.getText()).text

            embedText(extractedText)
            fs.unlinkSync(filePath)
            return extractedText

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