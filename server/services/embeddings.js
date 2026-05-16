import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const embeddings = async (text) => {

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize:1000,
        chunkOverlap:200,
    })

    const chunks = await splitter.createDocuments([text])
    console.log("Log:");
    console.log(chunks);
    
    
}

export default embeddings