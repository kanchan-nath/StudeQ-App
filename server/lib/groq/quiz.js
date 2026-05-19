import groq from "./groq.js";

const quiz = async (type, topic, subject) => {

    const prompt = `
You are a quiz generator for the subject: ${subject}.
Generate at least 5 ${type} questions on the topic: ${topic}.
The questions must be strictly relevant to "${topic}" within "${subject}".

Return ONLY valid JSON. No explanations, headings, notes, markdown fences, or extra text.

Response format:

[
  {
    "id": 1,
    "type": "${type}",
    "question": "Markdown formatted question",
    "options": ["Markdown option A", "Markdown option B", "Markdown option C", "Markdown option D"],
    "answer": "Exact text of correct option",
    "user_response": null,
    "is_correct": null
  }
]

Rules:
- Return valid JSON array only.
- Minimum 5 question objects.
- "id" starts at 1, increments by 1.
- "type" must always be exactly: "${type}".
- Every string value may contain Markdown formatting.
- "options" must be array of exactly 4 strings.
- "answer" must be exact text of one option from the "options" array.
- Distribute correct answers across all options — do not cluster on same position.
- "user_response" must always be null.
- "is_correct" must always be null.
- No trailing commas.
- Escape quotes properly inside strings.
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

    const { prompt_tokens, completion_tokens, total_tokens, total_time } = response.usage
    
    const model = response.model

    const result = response.choices[0].message.content

    await AIResponse.create({
        userId,
        prompt,
        response: result,
        model,
        promptTokens: prompt_tokens,
        completionTokens: completion_tokens,
        totalTokens: total_tokens,
        totalTime: total_time,

    })

    const data = JSON.parse(result)
    return data
}

const quizFromFile = async (topic, subject) => {

    const prompt = `
You are a quiz generator.

Here is the extracted content from the user's uploaded document:
"""
${extractedText}
"""

Generate at least 5 multiple choice questions based solely on the above content.

Return ONLY valid JSON. No markdown fences, no explanations, no extra text.

Response format:
{
  "title": "Provide a title based on the document content",
  "questions": [
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
}

Rules:
- Return valid JSON object with "title" string and "questions" array.
- Minimum 5 question objects in "questions".
- Every string may contain Markdown formatting.
- Each question must have exactly 4 options.
- Option IDs must be exactly: A, B, C, D — in order.
- "answer" must be one of: A, B, C, D.
- Distribute correct answers across A, B, C, D — no clustering.
- No trailing commas.
- Escape quotes properly inside strings.
- Return nothing except the JSON object.
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
    quizFromFile,
    flashcards
}