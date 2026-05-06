import groq from "./groq.js"

const summarizeText = async (text) => {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: `Think yourself as a teacher and now Summarize this ${text} for a student and list 5 key points and also give a title for it.`
            }
        ]
    })

    console.log(response.choices[0].message.content)
}

export { summarizeText }