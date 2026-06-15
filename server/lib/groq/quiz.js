import groq from "./groq.js";
import { AIResponse } from "../../models/aiResponse.model.js"
import logger from "../../logger/index.js";

const MODEL = process.env.GROQ_QUIZ_MODEL || "llama-3.3-70b-versatile"

const extractJSON = (raw) => {
    if (!raw) {
        throw new Error("Empty response from model")
    }

    let cleaned = raw.replace(/```(?:json)?\n?/gi, "").trim()
    const arrayMatch = cleaned.match(/(\[[\s\S]*\])/)
    const objectMatch = cleaned.match(/(\{[\s\S]*\})/)
    const jsonStr = arrayMatch?.[1] || objectMatch?.[1]
    if (!jsonStr) throw new Error("No valid JSON structure found in model response")

    try {
        return JSON.parse(jsonStr)

    } catch (error) {
        throw new Error(`JSON parse failed: ${error.message}. Raw: ${raw.slice(0, 200)}`)
    }
}

const logAIResponse = async (userId, prompt, rawResult, response) => {
    const { prompt_tokens, completion_tokens, total_tokens, total_time } = response.usage

    try {
        await AIResponse.create(
            {
                userId,
                prompt,
                response: rawResult,
                model: response.model,
                promptTokens: prompt_tokens,
                completionTokens: completion_tokens,
                totalTokens: total_tokens,
                totalTime: total_time,
            }
        )
    } catch (error) {
        logger.error("AIResponse log failed (non-critical):", error)
    }

}


const quiz = async (types, topic, subject, userId) => {

    if (!types || !topic || !subject || !userId) {
        throw new Error("quiz: types, topic, subject, userId all required")
    }
    const typesJson = JSON.stringify(Array.isArray(types) ? types : [types])

    const systemPrompt = `You are a quiz generator. Return ONLY valid JSON arrays. Never include markdown fences, explanations, or extra text.`

    const userPrompt = `Generate at least 5 ${typesJson} questions on the topic: "${topic}" within subject: "${subject}".

Return ONLY a valid JSON array:
[
  {
    "number": 1,
    "type": "one of ${typesJson}",
    "question": "Markdown formatted question",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Exact text of correct option",
    "userResponse": null,
    "isCorrect": null
  }
]

Rules:
- Minimum 5 questions. Type field cycles through ${typesJson} evenly.
- "answer" must exactly match one of the "options" strings.
- "userResponse" and "isCorrect" always null.
- Return NOTHING except the JSON array.`

    let response
    try {
        response = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            max_tokens: 3000,  
            temperature: 0.4,
        })

        
    } catch (error) {
        throw new Error(`Groq API error in quiz(): ${error.message}`)
    }

    const raw = response?.choices[0]?.message?.content

    if (!raw) throw new Error("quiz: empty response from Groq")

    const data = extractJSON(raw)

    await logAIResponse(userId, userPrompt, raw, response)
    return data

}

const quizFromFile = async (types, extractedText, userId) => {

    const prompt = `
You are a quiz generator.

Here is the extracted content from the user's uploaded document:
"""
${extractedText}
"""

Question types to use: ${types}

Generate at least 5 questions based solely on the above content.
Distribute the provided types evenly across all questions. Cycle through the types array if needed.

Return ONLY valid JSON. No markdown fences, no explanations, no extra text.

Response format:
{
  "title": "Provide a title based on the document content",
  "questions": [
    {
      "number": 1,
      "type": "one of the provided types",
      "question": "Markdown formatted question",
      "options": ["Markdown option A", "Markdown option B", "Markdown option C", "Markdown option D"],
      "answer": "Exact text of correct option",
      "userResponse": null,
      "isCorrect": null
    }
  ]
}

Rules:
- Return valid JSON object with "title" string and "questions" array.
- Minimum 5 question objects.
- "number" starts at 1, increments by 1.
- "type" must be picked by cycling through: ${types} — distribute evenly.
- Every string may contain Markdown formatting.
- "options" must be array of exactly 4 strings.
- "answer" must be exact text of one option from the "options" array.
- Distribute correct answers across all option positions — no clustering.
- "userResponse" must always be null.
- "isCorrect" must always be null.
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

    const { prompt_tokens, completion_tokens, total_tokens, total_time } = response.usage

    const model = response.model

    const rawData = response.choices[0].message.content

    const data = await JSON.parse(rawData)

    await AIResponse.create({
        userId,
        prompt,
        response: rawData,
        model,
        promptTokens: prompt_tokens,
        completionTokens: completion_tokens,
        totalTokens: total_tokens,
        totalTime: total_time,

    })


    // const data = JSON.parse(result)


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