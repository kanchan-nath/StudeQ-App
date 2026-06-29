import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { questionAnswer } from "../lib/groq/questionAnswer.js"
import { Tutorchat } from "../models/tutorChat.model.js"

const ask = asyncHandler(async (req, res) => {
    const { question, sessionId, subject } = req.body
    const userId = req.user.id
    if (!question || !sessionId) {
        throw new ApiError(400, "Question not found OR session end")
    }

    const data = await questionAnswer(question, subject)

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
    }else{
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
    }

    
    return res
        .status(200)
        .json(new ApiResponse(200, data, "Answer is provided of that question"))
})

const getChatHistory = asyncHandler(async(req, res)=>{
    const userId = req.user.id

    const chatHistory = await Tutorchat.find({
        userId:userId
    })

    console.log(chatHistory);
    
    return res
    .status(200)
    .json(new ApiResponse(200, chatHistory, "All chat history fetched successfully"))
})
export {
    ask,
    getChatHistory
}