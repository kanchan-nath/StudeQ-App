import dotenv from "dotenv"
dotenv.config()
import { Pinecone } from "@pinecone-database/pinecone";
import embedText from "./embedText.js";
import chunking from "./chunking.js";
import textExtractor from "./textExtractor.js";

const vectorDB = async (file) => {
    const extractedText = await textExtractor(file)
    console.log("Extracted Txt:",extractedText);
    
    const chunks = await chunking(extractedText)

    const pc = new Pinecone(
        {
            apiKey: process.env.PINECONE_API_KEY
        }
    )

    const index = await pc.index("vectordb")

    const namespace = process.env.PINECONE_NAME_SPACE ? process.env.PINECONE_NAME_SPACE.replace(/['"]/g, '') : "Kanchan_12345"

    const ns = index.namespace(namespace);

    const embeddings = await Promise.all(
        chunks.map(chunk => embedText(chunk))
    );

    const records = chunks.map((chunk, i) => (
        {
            id: `doc_${i}`,
            values: embeddings[i],
            metadata: {
                text: chunk,
            }
        }
    ))

    console.log("Records:",records);
    
    await ns.upsert({ records })
    
}

const queryDB = async(query)=>{
    const pc = new Pinecone(
        {
            apiKey: process.env.PINECONE_API_KEY
        }
    )

    const index = pc.index("vectordb")

    const namespace = process.env.PINECONE_NAME_SPACE ? process.env.PINECONE_NAME_SPACE.replace(/['"]/g, '') : "Kanchan_12345"

    const ns = index.namespace(namespace);


    const queryVector = await embedText(query)

    const results = await ns.query({
        vector: queryVector,
        topK: 5,
        includeMetadata: true
    })
    
    const topChunks = results.matches.map((m)=>(m.metadata.text))
    console.log("Top chunks:",topChunks);
    
    return topChunks
}
export  {vectorDB, queryDB}
