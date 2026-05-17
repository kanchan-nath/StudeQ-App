import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { vectorDB, queryDB } from "../services/vectorDB.js"
import llmCall from "../lib/groq/llmCall.js"
import { Documents } from "../models/document.model.js"
import { v4 as uuid4 } from "uuid"
import { ChatRoom } from "../models/chatRoom.model.js"

const uploadFile = asyncHandler(async (req, res) => {
    const userId = req.user?.id
    // const {query} = req.body

    // if(!query){
    //     throw new ApiError(400, "Type something")
    // }
    const localFile = req.files.file[0]
    const chatRoomKey = uuid4()

    if (!chatRoomKey) {
        throw new ApiError(400, "chatRoomKey generation failed, Try again!")
    }
    const metadata = await Documents.create(
        {
            userId,
            originalName: localFile.originalname,
            encoding: localFile.encoding,
            mimeType: localFile.mimetype,
            fileName: localFile.filename,
            size: localFile.size
        }
    )

    if (!metadata) {
        throw new ApiError(400, "metadata saving error")
    }
    const id = metadata._id
    await vectorDB(localFile)
    await ChatRoom.create({
        userId,
        chatRoomKey
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { id, chatRoomKey }, "Document's metadata uploaded successfully"))

})

const askQuery = asyncHandler(async (req, res) => {
    const { id, chatRoomKey } = req.params
    const userId = req.user.id
    const { query } = req.body

    if (!query) {
        throw new ApiError(400, "Query is not found")
    }

    const topChunks = await queryDB(query)
    const results = await llmCall(query, topChunks, userId)

    await ChatRoom.findOneAndUpdate(
        {
            _id: id,
            userId,
            chatRoomKey
        },
        {
            $push: {
                messages: {
                    $each: [
                        {
                            role: "user",
                            content: query
                        },
                        {
                            role: "assistant",
                            content: results
                        }
                    ]
                }
            }
        },
    )

    return res
        .status(200)
        .json(new ApiResponse(200, results, "Response is provided successfully"))
})

export {
    uploadFile,
    askQuery
}