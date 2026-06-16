export const logAIResponse = async (userId, prompt, rawResult, response) => {
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