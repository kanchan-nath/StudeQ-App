import fs from "fs"
import { exec } from "child_process"
import path from "path"

const pdfToImages = async (filePath, totalPages) => {
    const outputDir = "/Users/kanchannath/Coding/Spark.E/server/uploads/images"
    new Promise((resolve, reject) => {

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync("images", { recursive: true })
        }

        const imagePaths = []

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {

            const outputFile = path.join(outputDir, `Page${pageIndex + 1}.jpg`)

            const command = `convert -density 300 "${filePath}[${pageIndex}]" -quality 90 "${outputFile}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Page ${pageIndex + 1} failed: ${error.message}`);
                }

                imagePaths.push(outputFile)

                if (pageIndex === totalPages) {
                    resolve(imagePaths)
                }
            })
        }
    })

    if (!fs.existsSync(outputDir)) {

    }
}


export default pdfToImages