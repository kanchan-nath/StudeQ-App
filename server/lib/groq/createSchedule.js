import groq from "./groq.js"
import path from "path"
import fs from "fs"
import { prompt_createSchedule } from "../prompt.js"

// pipe-delimited text → array of objects
const parseTable = (raw) => {
    try {
        const cleaned = raw.trim().replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '')
        const parsed = JSON.parse(cleaned)
        return Array.isArray(parsed) ? parsed : (parsed.data ?? [])
    } catch {
        return []
    }
}

const createSchedule = async (folder) => {
    try {
        const files = fs.readdirSync(folder).sort()
        const allRows = []
        const batchSize = 3

        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize)

            const batchResults = await Promise.all(
                batch.map(async (file) => {
                    const imgPath = path.join(folder, file)
                    const base64 = fs.readFileSync(imgPath).toString("base64")

                    const response = await groq.chat.completions.create({
                        model: "meta-llama/llama-4-scout-17b-16e-instruct",
                        messages: [{
                            role: "user",
                            content: [
                                { type: "text", text: prompt_createSchedule },
                                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}` } }
                            ]
                        }],
                        temperature: 0,        // deterministic = accurate extraction
                        max_tokens: 8192
                    })

                    const raw = response.choices[0].message.content
                    
                    return parseTable(raw)     // returns array of objects
                })
            )

            batchResults.forEach(rows => allRows.push(...rows))
        }

        fs.rmSync(folder, { recursive: true, force: true })
        console.log(allRows);
        
        return allRows   // clean array of objects → ready for MongoDB .insertMany()

    } catch (error) {
        console.error("Error:", error.message)
        fs.rmSync(folder, { recursive: true, force: true })
        return []
    }
}

export default createSchedule