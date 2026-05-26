import OpenAi from "openai"
import dotenv from "dotenv"
import { prompt_PromptOptimizer } from "../lib/prompt.js"

const openai = new OpenAi({
    apiKey: process.env.NVIDIA_DEEPSEEK_FLASH_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1'
})

const promptOptimizer = async (userQuery) => {
    console.log("Kanchan");

    try {
        console.log("Checked 1");
        
        const response = await openai.chat.completions.create({
            model: "mistralai/mistral-large-3-675b-instruct-2512",
            messages: [
                {
                    "role": "user",
                    "content": prompt_PromptOptimizer.replace("{{USER_QUERY}}", userQuery)
                }
            ],
            
            temperature: 1,
            top_p: 0.95,
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