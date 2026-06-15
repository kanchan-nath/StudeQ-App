import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { summarizeText } from "../lib/groq/summarizer.js"
import { Note } from "../models/note.model.js"
import {AIResponseQueue} from "../services/queue.js"

const titleExtract = (markdownResponse) => {
    const match = markdownResponse.match(/##\s+Topic\s*\n+(.+)/);
    return match ? match[1].trim() : "Summary";
};

const createNote = asyncHandler(async (req, res) => {
    const { content } = req.body
    const userId = req.user.id

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const result = await summarizeText(content, userId)

    const title = await titleExtract(result)

    if (!result) {
        // throw new ApiError(400, "Something went wrong, Try again !")
        const response = await AIResponseQueue(userId, content)        
        
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "retrying"))

    }
    
    const data = await Note.create({
        userId,
        title,
        content,
        summary: result,
    })
    return res
        .status(200)
        .json(new ApiResponse(200, data, "Content created successfuly"))

})

const getNote = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const allNotes = await Note.find({
        userId: userId
    }).sort({isPinned:-1})

    return res
        .status(200)
        .json(new ApiResponse(200, allNotes, "All notes fetched successfully"))

})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    if (!id) {
        throw new ApiError(400, "Not found")
    }

    const response = await Note.findByIdAndDelete({
        _id: id,
        userId: userId
    })
    console.log(response);

    return res
        .status(200)
        .json(new ApiResponse(200, response, "Notes deleted succesfully"))
})

const updateNote = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { id } = req.params
    const userId = req.user.id

    if (!content || !id) {
        throw new ApiError(400, "Content is not changed anything")
    }

    const result = await summarizeText(content)
    const { title, summary, keyPoints } = result
    console.log(title);


    const existedNote = await Note.findOneAndUpdate(
        {
            _id: id,
            userId
        },
        {
            title,
            summary,
            keyPoints
        },
        {
            returnDocument: 'after'
        }
    )

    if (!existedNote) {
        throw new ApiError(404, "Summarizing content not exit")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Note is updated"))

})

const tooglePin = asyncHandler(async (req, res) => {
    const { newPinned } = req.body
    
    const { id } = req.params

    const userId = req.user.id

    await Note.findOneAndUpdate(
        {
            userId,
            _id: id
        },
        {
            isPinned: newPinned
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "pin successful"))
})
export {
    createNote,
    getNote,
    deleteNote,
    updateNote,
    tooglePin,
    titleExtract
}