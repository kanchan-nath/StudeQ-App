import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { summarizeText } from "../lib/groq/summarizer.js"
import { Note } from "../models/note.model.js"

const createNote = asyncHandler(async (req, res) => {
    const { content } = req.body
    const userId = req.user.id

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const result = await summarizeText(content)
    
    if(!result){
        throw new ApiError(400, "Something went wrong, Try again !")
    }
    
    const {title, summary, keyPoints} = result

    await Note.create({
        userId,
        title,
        summary,
        keyPoints
    })
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Content created successfuly"))

})

const getNote = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const allNotes = await Note.find({
        userId:userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, allNotes, "All notes fetched successfully"))
    
})

export {
    createNote,
    getNote
}