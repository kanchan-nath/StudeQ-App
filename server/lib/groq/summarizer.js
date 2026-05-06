import groq from "./groq.js"

const summarizeText = async (text) => {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: `You are a teacher. Summarize this text for a student: "${text}"
List 5 key points and give a title.

IMPORTANT: Return ONLY a raw JSON object in this exact format, no extra text, no markdown:
{
  "title": "...",
  "summary": "...",
  "keyPoints": ["...", "...", "...", "...", "..."]
}`,
                // stream:true,
            }
        ]
    })

    const raw = response.choices[0].message.content
    const data = JSON.parse(raw)

    return data
}

export { summarizeText }