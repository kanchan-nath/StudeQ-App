import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import embedText from "./embedText.js";

const chunking = async (text) => {

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize:300,
        chunkOverlap:50,
    })

    const chunks = await splitter.splitText(text)
    // embedText(chunks)
    return chunks
}

export default chunking