export const extractJSON = (raw) => {
    if (!raw) {
        throw new Error("Empty response from model")
    }

    let cleaned = raw.replace(/```(?:json)?\n?/gi, "").trim()
    const objectMatch = cleaned.match(/(\{[\s\S]*\})/)
    const arrayMatch = cleaned.match(/(\[[\s\S]*\])/)
    const jsonStr = objectMatch?.[1] || arrayMatch?.[1]

    if (!jsonStr) throw new Error("No valid JSON structure found in model response")

    try {
        return JSON.parse(jsonStr)
    } catch (error) {
        throw new Error(`JSON parse failed: ${error.message}. Raw: ${raw.slice(0, 200)}`)
    }
}