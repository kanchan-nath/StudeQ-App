import groq from "./groq.js"

const imageAnalyze = async(image, mimtype)=>{
    const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages:[
            {
                role:"user",
                content:[
                    {
                        type:"text",
                        text: "Analyze this image and explain it in the context of student studies. Describe any diagrams, text, charts, or concepts visible, and explain how a student can use this for learning."
                    },
                    {
                        type:"image_url",
                        image_url:{
                            url: `data:${mimtype};base64,${image}`
                        }
                    }
                ]
            }
        ]
    })

    const data = response.choices[0].message.content

    return data
    
}

export {imageAnalyze}