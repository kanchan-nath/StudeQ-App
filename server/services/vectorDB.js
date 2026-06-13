import { Pinecone } from "@pinecone-database/pinecone";
import embedText from "./embedText.js";
import chunking from "./chunking.js";
import textExtractor from "./textExtractor.js";
import logger from "../logger/index.js"

let pcClient = null

const getIndex = ()=>{
    if(!pcClient){
        pcClient = new Pinecone(
            {
                apiKey: process.env.PINECONE_API_KEY

            }
        )
    }

    return pcClient.index(process.env.PINECONE_INDEX_NAME)
}

const getNamespace = (userId)=>{
    if(!userId){
        throw new Error("vectorDB: userId required for namespace isolation")
    }

    return `user_${userId}`
}

const vectorDB = async (file, userId, documentId) => {

    if (!userId || !documentId) {
        throw new Error("vectorDB: userId and documentId are required")
    }

    const extractedText = await textExtractor(file)
    const chunks = await chunking(extractedText)

    const index = getIndex()
    const ns = index.namespace(getNamespace(userId));

    const records= []

    for(let i=0; i<chunks.length;i++){
        const values = await embedText(chunks[i])

        records.push(
            {
                id: `${documentId}_chunk_${i}`,
                values,
                metadata:{
                    text:chunks[i],
                    userId,
                    documentId,
                    chunkIndex: i,
                }
            }
        )
    }

    await ns.upsert( records )
    logger.info(`Upserted ${records.length} chunks for document ${documentId} (user ${userId})`)
    
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
