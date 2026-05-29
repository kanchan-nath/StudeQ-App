import fs from "fs"
import { exec } from "child_process"
import path from "path"

const pdfToImages = async (filePath, totalPages, outputDir) => {
    
    fs.mkdirSync(outputDir, { recursive: true })
    
    return new Promise((resolve, reject) => {

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync("images", { recursive: true })
        }

        const imagePaths = []
        let completed = 0 

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {

            const outputFile = path.join(outputDir, `Page${pageIndex + 1}.jpeg`)

            const command = `convert -density 300 "${filePath}[${pageIndex}]" -quality 90 "${outputFile}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Page ${pageIndex + 1} failed: ${error.message}`);
                }

                imagePaths.push(outputFile)
                completed++

                if (completed === totalPages) {
                    resolve(imagePaths)
                }
            })
        }
    })
}

export default pdfToImages