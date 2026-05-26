import OpenAi from "openai"
import 
const openai = new OpenAi({
    apiKey: process.env.OPENAI_DEEPSEEK_FLASH,
    baseURL: 'https://integrate.api.nvidia.com/v1'
})

const promptOptimizer = async ()=>{
    const completion = await openai.chat.completions.create({
        model: "deepseek-ai/deepseek-v4-flash",
        messages:[
            {
                "role": "user",
                "content":prompt
            }
        ]
    })
}