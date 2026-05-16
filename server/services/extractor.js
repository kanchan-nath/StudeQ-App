import {ApiError}from "../utils/Async.js"
import {PDFParse} from "pdf-parse"
import fs from "fs"
import XLSX from "xlsx"
import Tesseract from "tesseract.js"

const extractor = async (file) => {
    const mimeType = file.mimetype
    const filePath = file.path

    if (mimeType == "application/pdf") {   
        const dataBuffer = fs.readFileSync(file.path)
        const uint8Array = new Uint8Array(dataBuffer)
        const parser = new PDFParse(uint8Array)
        const extractedText = (await parser.getText()).text

        return extractedText

    } else if (mimeType == "application/vnd.ms-excel"){
        const wrokbook = XLSX.readFile(filePath)
        const sheet = wrokbook.Sheets[wrokbook.SheetNames[0]]

        const result = XLSX.utils.sheet_to_json(sheet)
        const extractedText = JSON.stringify(result)
        
        console.log(extractedText);
        return extractedText
        
    }else if ((["image/jpeg", "image/png", "image/webp"].includes(mimeType))){
        const dataBuffer = fs.readFileSync(filePath)

        const {data} = await Tesseract.recognize(filePath, "eng")
        const extractedText = data.text
        return extractedText        

    } else if (mimeType == "text/plain"){
        const extractedText = fs.readFileSync(filePath, 'utf8')

        return extractedText        
    }else{
        throw new ApiError(404, "File not supported")
    }
}

export default extractor