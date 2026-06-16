import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import embedText from "./embedText.js";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 200,
})

const chunking = async (text) => {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
        throw new Error("chunking: non-empty string required")
    }

    const chunks = await splitter.splitText(text)

    if (chunks.length === 0) {
        throw new Error("chunking: no chunks produced — text may be too short or malformed")
    }

    
    return chunks
}

export default chunking