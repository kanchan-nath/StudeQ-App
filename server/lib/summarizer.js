import genAI from "./genAI.js"

const summarizeText = async (text) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Think yourself as a teacher and now Summarize this ${text} for a student and list 5 key points`

    const result = await model.generateContent(prompt)
    console.log(result);
    
}
summarizeText("Anime is good")