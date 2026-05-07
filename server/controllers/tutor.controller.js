import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { questionAnswer } from "../lib/groq/question-answer.js"
import { Tutorchat } from "../models/tutorchat.model.js"

const ask = asyncHandler(async (req, res) => {
    const { question, sessionId } = req.body
    const userId = req.user.id
    if (!question || !sessionId) {
        throw new ApiError(400, "Question not found OR session end")
    }

    const data = await questionAnswer(question)

    let chat = await Tutorchat.findOne({
        sessionId
    })

    if (!chat) {
        const res = await Tutorchat.create({
            sessionId,
            userId,
            messages: [
                {
                    role: "user",
                    content: question
                },
                {
                    role: "tutor",
                    content: data
                }
            ]
        })
    }

    await Tutorchat.updateOne(
        { sessionId },
        {
            $push: {
                messages: {
                    $each: [
                        { role: "user", content: question },
                        { role: "tutor", content: data }
                    ]
                }
            }
        }
    )
    return res
        .status(200)
        .json(new ApiResponse(200, data, "Answer is provided of that question"))
})

export {
    ask
}