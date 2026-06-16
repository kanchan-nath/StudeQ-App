import groq from "./groq.js"
import { webSearch } from "../websearch.js"
import logger from "../../logger/index.js"

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

const prepareSearchContext = (searchResult) => {
    if (!searchResult || typeof searchResult !== "string" || searchResult.trim().length < 10) {
        return null
    }
    return searchResult.slice(0, MAX_SEARCH_CHARS)
}

const questionAnswer = async (query, subject, userId) => {
    if (!query || typeof query !== "string") {
        throw new Error("questionAnswer: query is required")
    }

    const safeSubject = sanitizeSubject(subject)

    let searchResult = null
    try {
        const raw = await webSearch(query)
        searchResult = prepareSearchContext(raw) 
    } catch (error) {
        logger.warn(`webSearch failed for query "${query}": ${err.message}`)
    }

    const searchSection = searchResult
        ? `Use the following search results as your PRIMARY source. Do not invent facts not present in them.\n\n<search_results>\n${searchResult}\n</search_results>`
        : `No web search results are available. Answer from your training knowledge and clearly state you are doing so.`
        
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