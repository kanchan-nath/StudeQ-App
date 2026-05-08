import groq from "./groq.js";

const quiz = async(topic, subject)=>{

    const prompt = `
        
Generate at least 5 multiple choice questions(you may generate more if the topic warrants it).

Return ONLY valid JSON.
Do not add explanations, headings, notes, markdown fences, or extra text outside the JSON.

Response format:

    [
        {
            "question": "Markdown formatted question",
            "options": [
                { "optionId": "A", "text": "Markdown formatted option" },
                { "optionId": "B", "text": "Markdown formatted option" },
                { "optionId": "C", "text": "Markdown formatted option" },
                { "optionId": "D", "text": "Markdown formatted option" }
            ],
            "answer": "A"
        }
    ]

    Rules:
    - The entire response must be valid JSON array.
- The array must contain a minimum of 5 question objects.
- Every string value may contain Markdown formatting.
- Each question must contain exactly 4 options.
- Option IDs must always be exactly: A, B, C, D — in that order.
- "answer" must contain only the single correct option ID(one of: A, B, C, or D).
- Do not duplicate answer text inside "answer".
- Distribute correct answers across A, B, C, D — do not cluster them on the same option.
- Do not use trailing commas.
- Escape quotes properly inside strings.
- Do not return anything except the JSON array.

    `

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages:[
            {
                role:"user",
                content: prompt
            }
        ]
    })

    const result = response.choices[0].message.content
    const data = JSON.parse(result)
    return data
}
export {quiz}