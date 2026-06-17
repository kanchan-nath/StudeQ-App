import OpenAi from "openai"
import dotenv from "dotenv"
import { prompt_PromptOptimizer } from "../lib/prompt.js"

const openai = new OpenAi({
    apiKey: process.env.NVIDIA_DEEPSEEK_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1'
})

const promptOptimizer = async (userQuery) => {

    try {        
        const response = await openai.chat.completions.create({
            model: "meta/llama-3.2-3b-instruct",
            messages: [
                {
                    "role": "user",
                    "content": prompt_PromptOptimizer.replace("{{USER_QUERY}}", userQuery)
                }
            ],
            
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 1024,
            // chat_template_kwargs: { "thinking": true, "reasoning_effort": "high" },
            // stream: true
        })
        const data = response.choices[0].message.content
        console.log(data);
        
        return data
    } catch (error) {
        console.error("ERROR:", error.message);

    }



}

export{
    promptOptimizer
}