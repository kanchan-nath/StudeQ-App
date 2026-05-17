import groq from "./groq.js";

const guadianLayer = async (rawQuery, )=>{
    const prompt = ` Before hitting main LLM:
const guardianPrompt = 
You are a study assistant optimizer.
User query: "${rawQuery}"
Document excerpt: "${docChunk}"

    Tasks:
    1. Rewrite query to be clearer and more specific
    2. Identify subject / topic
    3. Rate query quality 1 - 10
    4. Output JSON: { improvedQuery, topic, qualityScore, changes }
`
}

export default guadianLayer


// MongoDB collection: guardian_logs
// {
//     originalQuery,
//         improvedQuery,
//         changes,
//         userFeedback,     // did final answer satisfy user?
//         timestamp
// }