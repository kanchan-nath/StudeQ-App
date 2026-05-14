import groq from "./groq.js";

const pdfToFlashcard = async(text)=>{

    const prompt  =`
    You are a flashcard generator. User gives ${text}. Extract key concepts. 
Also give the difficulety level - easy/medium/hard.

Return the response ONLY in valid JSON format as an array like this:


{
    "difficultyLevel": "easy/medium/hard",
    "card":[
        {
            "front": "Question or term",
            "back": "Answer or definition"
        }
    ]
}
Rules:
- Front: short question or term
- Back: concise answer (1-3 lines max)
- Cover all major concepts, definitions, formulas, facts
- No filler cards
- Output ONLY valid JSON. No markdown. No preamble.
    `
    const response = await groq.chat.completions.create({
        model:"meta-llama/llama-4-scout-17b-16e-instruct",
        messages:[
            {
                role:"user",
                content: prompt
            }
        ]
    })

    const raw = response.choices[0].message.content
    // const data = JSON.parse(raw)
    return raw
}
export {pdfToFlashcard}