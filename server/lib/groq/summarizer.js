import groq from "./groq.js"

const summarizeText = async (text) => {

    const prompt = `
        You are a study assistant. Summarize the following text for a student.

Use markdown formatting throughout:
- **Bold** for key terms and important words
- *Italic* for definitions or emphasis
- "code" for technical terms, formulas, or names
- > blockquote for critical rules or must-remember lines
- ==highlight== for exam-critical points (if renderer supports it)

Format the summary exactly like this:

##  Topic
One line — what this text is about.

##  Key Concepts
- Bullet each major idea — **bold the concept name**, then explain briefly

##  Detailed Summary
3–5 paragraphs. Use **bold** for important terms. Use *italics* for definitions.
Wrap critical rules in blockquotes:
> Rule or principle to remember

##  Quick Recap (TL;DR)
2–3 sentences. Bold the most critical words.

##  Likely Exam Points
- ==**Term or fact**== — short explanation
- Repeat for each point

---
Text to summarize:
${text}
    `
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt,
                // stream:true,
            }
        ]
    })

    const raw = response.choices[0].message.content
    // const data = JSON.parse(raw)

    return raw
}

export { summarizeText }