import { AIResponse } from "../../models/aiResponse.model.js";
import groq from "./groq.js";
import { promptOptimizer } from "../../services/promptOptimizer.js";

const llmCall = async (query, topChunks, userId) => {

    const optimizedPrompt  = await promptOptimizer(query)
    const prompt = optimizedPrompt + `Context:${topChunks}`    
    
    const response = await groq.chat.completions.create(
        {
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                },
            ],
            temperature: 0.2,
            max_tokens: 1024,
        },
        {
            response: "true"
        }
    )

    const { prompt_tokens, completion_tokens, total_tokens, total_time } = response.usage
    const model = response.model

    const data = response.choices[0].message.content

    await AIResponse.create({
        userId,
        prompt,
        response: data,
        model,
        promptTokens: prompt_tokens,
        completionTokens: completion_tokens,
        totalTokens: total_tokens,
        totalTime: total_time,
        
    })
    return data

}

export default llmCall