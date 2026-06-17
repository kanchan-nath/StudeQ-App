import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { summarizeText } from "../lib/groq/summarizer.js"
import { Note } from "../models/note.model.js"
import { AIResponseQueue } from "../services/queue.js"
import { noteValidator } from "../validators/note.validator.js"

const titleExtract = (markdownResponse) => {
    if (!markdownResponse) return "Summary"
    const match = markdownResponse.match(/##\s+Topic\s*\n+(.+)/);
    return match ? match[1].trim() : "Summary";
};

const createNote = asyncHandler(async (req, res) => {

    const { data, error } = noteValidator.safeParse(req.body)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { content } = data

    if (!content) {
        throw new ApiError(400, "Content is required")
    }
    const userId = req.user.id

    const response = await summarizeText(content, userId)

    if (!response) {
        await AIResponseQueue(userId, content)

        return res
            .status(202)
            .json(new ApiResponse(202, {}, "Summarization queued — you'll be notified when ready"))

    }
    const title = await titleExtract(response)

    const data = await Note.create({
        userId,
        title,
        content,
        summary: result,
    })
    return res
        .status(201)
        .json(new ApiResponse(201, data, "Note created successfully"))

})

const getNote = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const allNotes = await Note.find({
        userId: userId
    }).sort({ isPinned: -1, createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, allNotes, "All notes fetched successfully"))

})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid note ID")
    }

    const userId = req.user.id

    const deleted = await Note.findByIdAndDelete({
        _id: id,
        userId: userId
    })

    if (!deleted) {
        throw new ApiError(404, "Note not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Note deleted succesfully"))
})

const updateNote = asyncHandler(async (req, res) => {

    const { data, error } = noteValidator.safeParse(req.body)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { content } = data

    if (!content) {
        throw new ApiError(400, "Content is required")
    }
    const { id } = req.params

    if (!content || !id) {
        throw new ApiError(400, "Content and id are required")
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid note ID")

    }
    const userId = req.user.id

    const response = await summarizeText(content, userId)

    if (!response) {
        throw new ApiError(500, "Summarization failed, please try again")

    }

    const title = titleExtract(result)

    const updated = await Note.findOneAndUpdate(
        {
            _id: id,
            userId
        },
        {
            content,
            title,
            summary: response
        },
        {
            returnDocument: 'after'
        }
    )

    if (!updated) {
        throw new ApiError(404, "Note not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Note updated successfully"))

})

const tooglePin = asyncHandler(async (req, res) => {
    const { newPinned } = req.body
    if (typeof newPinned !== "boolean") {
        throw new ApiError(400, "newPinned must be a boolean")
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid note ID")
    }
    const userId = req.user.id

    const updated = await Note.findOneAndUpdate(
        {
            userId,
            _id: id
        },
        {
            isPinned: newPinned
        },
        { returnDocument: "after" }
    )

    if(!updated){
        throw new ApiError(404, "Note not found")   
    }
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