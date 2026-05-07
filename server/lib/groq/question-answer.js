import groq from "./groq.js"

const questionAnswer = async (text) => {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: `You are a helpful study tutor for Indian students. Answer this clearly: ${text}`,
                // stream:true,
            }
        ]
    })

    const raw = response.choices[0].message.content
    // const data = JSON.parse(raw)

    const data = raw

    return data
}

export { questionAnswer }