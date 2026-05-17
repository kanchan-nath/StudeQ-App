import groq from "./groq.js";

const llmCall = async (query, topChunks) => {

    const prompt = `You are a helpful assistant. Answer user questions using ONLY the context provided below.
If answer not in context, say I don't know based on provided documents.
Do not use prior knowledge. Be concise and accurate.

Context
${topChunks}

Question
${query}`
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt
            },
            // temperature = 0.2,
            // max_tokens = 1024,
        ]
    })

    const data = response.choices[0].message.content
    return data
    
}

export default llmCall