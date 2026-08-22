import { json } from "express"
import groq from "./groq.js"

const generateStudyPlan = async (subjects, hoursPerDay, goalDate)=>{

    const SYSTEM_PROMPT = `
        You are a study planner. When user asks for a study plan, respond ONLY with a valid JSON array. No explanation, no markdown, no backticks.

Format:
[
  {
    "day": 1,
    "subject": "string",
    "topic": "string",
    "duration": "string (e.g. 2 hours)"
  }
]

Rules:
- Always return exactly 7 objects (day 1 to 7)
- Topics must be specific, not vague
- Duration realistic (30 min to 3 hours)
- No preamble, no postamble, raw JSON only
- Plan must be exam-optimized: prioritize high-weightage, frequently tested topics first
- Order topics by importance — cover most marks-yielding content early
- Final days focus on revision and weak areas to maximize retention before exam
- Every topic must directly contribute to scoring highest marks in a class exam

User Data:
Subjects: ${subjects}, Goal-Date: ${goalDate}, Hours-per-day:${hoursPerDay}
    `
    const response = await groq.chat.completions.create({
        model:'openai/gpt-oss-120b',
        messages:[
            {
                role:"system",
                content: SYSTEM_PROMPT
            },
        ]
    })

    const raw = await response.choices[0].message.content
    const data = JSON.parse(raw)
    return data
}

export {generateStudyPlan}