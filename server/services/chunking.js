import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import embedText from "./embedText.js";

const chunking = async (text) => {

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize:1000,
        chunkOverlap:200,
    })

    const chunks = await splitter.splitText(text)
    // embedText(chunks)
    return chunks
}

export default chunking