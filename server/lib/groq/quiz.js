import groq from "./groq.js";

const quiz = async (topic, subject) => {

    const prompt = `
You are a quiz generator for the subject: ${subject}.
Generate at least 5 multiple choice questions on the topic: ${topic}.
The questions must be strictly relevant to "${topic}" within "${subject}".

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
- "answer" must contain only the single correct option ID (one of: A, B, C, or D).
- Do not duplicate answer text inside "answer".
- Distribute correct answers across A, B, C, D — do not cluster them on the same option.
- Do not use trailing commas.
- Escape quotes properly inside strings.
- Do not return anything except the JSON array.
`

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    })

    const result = response.choices[0].message.content
    const data = JSON.parse(result)
    return data
}

const flashcards = async (topic, subject) => {
    const prompt = `
       You are a flashcard generator for the subject: ${subject}.

Generate at least 5 flashcards on the topic: ${topic}.

Return the response ONLY in valid JSON format as an array like this:

[
  {
    "front": "Question or term",
    "back": "Answer or definition"
  }
]

Rules:
- Exactly 10 flashcards
- "front" should contain a short question, keyword, or concept
- "back" should contain a clear and concise explanation or answer
- Keep the language simple and student-friendly
- Do not include markdown, extra text, or explanations outside the JSON
    `

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    })

    const raw = response.choices[0].message.content
    const data = JSON.parse(raw)
    return data
}
export {
    quiz,
    flashcards
}