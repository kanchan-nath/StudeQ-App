import groq from "./groq.js"
import { webSearch } from "../websearch.js"

const MODEL = process.env.GROQ_QA_MODEL || "llama-3.3-70b-versatile"
const MAX_SEARCH_CHARS = 12_000
const MAX_SUBJECT_LENGTH = 100

const sanitizeSubject = (subject) => {
    if (!subject || typeof subject !== "string") return "General Studies"
    return subject
        .slice(0, MAX_SUBJECT_LENGTH)
        .replace(/[^\w\s\-]/g, "") 
        .trim() || "General Studies"
}

const questionAnswer = async (query, subject) => {
    const searchResult = await webSearch(query)

    const prompt = `
    Think yourself as a ${subject} Teacher.
    Format all responses using markdown.
    Use ## for section headers, **bold** for key terms,
    bullet lists for multiple items, and keep paragraphs short.
    Now Use the following search results to answer accurately.

    Search Results:
    ${searchResult}

    Question:
    ${query}

    Answer properly using the search results.`

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt,
                // stream:true,
            }
        ]
    })

    const raw = response.choices[0].message.content
    // const data = JSON.parse(raw)

    const data = raw

    return data
}

export { questionAnswer }