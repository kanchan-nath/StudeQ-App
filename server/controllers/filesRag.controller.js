import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { vectorDB, queryDB, deleteDocumentVectors } from "../services/vectorDb.js"
import llmCall from "../lib/groq/llmCall.js"
import { Documents } from "../models/document.model.js"
import { v4 as uuid4 } from "uuid"
import { ChatRoom } from "../models/chatRoom.model.js"
import mongoose from "mongoose"
import { ragQueryValidator } from "../validators/ragQuery.validator.js"
import logger from "../logger/index.js"

const isValidId = (id)=>{
    return mongoose.Types.ObjectId.isValid(id)
}

const uploadFile = asyncHandler(async (req, res) => {
    const userId = req.user?.id

    const localFile = req.files?.file?.[0]

    if (!localFile) {
        throw new ApiError(400, "No file uploaded")
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

    const documentId = metadata._id
    const documentName = metadata.originalName

    let data
    try {
        const chunkCount = await vectorDB(localFile, userId, documentId)
        await Documents.findByIdAndUpdate(documentId, { chunkCount }) 
        data = await ChatRoom.create({
            userId,
            docId: documentId
        })
    } catch (error) {
        await Documents.findByIdAndDelete(documentId).catch(()=>{})
        await deleteDocumentVectors(userId, documentId).catch(() => { })

        throw new ApiError(500, "File processing failed, please try again")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, data, "Document's metadata uploaded successfully"))

})

const askQuery = asyncHandler(async (req, res) => {
    const { id, docId } = req.params
    
    if (!id) {
        throw new ApiError(400, "Something went wrong")
    }

    if (!docId) {
        throw new ApiError(400, "Something went wrong")
    }

    if(!isValidId(id)){
        throw new ApiError(400, "Invalid Id")
    }
    if (!isValidId(docId)) {
        throw new ApiError(400, "Invalid Document Id")
    }

    const userId = req.user.id

    const {data, error} = ragQueryValidator.safeParse(req.body)
    
    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { query } = data    

    const topChunks = await queryDB(query, userId, docId)
    const results = await llmCall(query, topChunks, userId)
    
    await ChatRoom.findOneAndUpdate(
        {
            userId,
            _id:id
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
        .json(new ApiResponse(200, results, "Response provided successfully"))
})

const allChatsMessage = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Something went wrong")
    }

    if (!isValidId(id)) {
        throw new ApiError(400, "Invalid Id")
    }

    const userId = req.user.id

    const data = await ChatRoom.findOne(
        {
            _id:id,
            userId
        }
    )

    if(!data){
        throw new ApiError(404, "Chat room not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Messages fetched"))
})

const updateQuery = asyncHandler(async (req, res) => {
    
    const { id, chatId } = req.params

    const messageId = chatId

    if (!id || !messageId) {
        throw new ApiError(400, "Room id and message id are required")
    }

    if (!isValidId(id) || !isValidId(messageId)) {
        throw new ApiError(400, "Invalid id")
    }

    const {data, error} = ragQueryValidator.safeParse(req.body)
    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { query } = data

    const userId = req.user.id

    const topChunks = await queryDB(query, userId)

    if (!topChunks?.length) {
        throw new ApiError(400, "Could not retrieve relevant context")
    }

    const results = await llmCall(query, topChunks, userId)

    if (!results) {
        throw new ApiError(400, "Query answer problem, Try Again")
    }

    const chatRoom = await ChatRoom.findOne({ userId, _id:id })
    if (!chatRoom) throw new ApiError(404, "Chat room not found")

    const msgIndex = chatRoom.messages.findIndex(
        m => m._id.toString() == chatId
    )

    if (msgIndex === -1) throw new ApiError(404, "Message not found")

        const nextMsg = chatRoom.messages[msgIndex+1]
        if(!nextMsg || nextMsg.role !=="assistant"){
            throw new ApiError(400, "Message pair structure invalid")
        }

    chatRoom.messages[msgIndex].content = query
    chatRoom.messages[msgIndex + 1].content = results

   await chatRoom.save()

    return res
        .status(200)
        .json(new ApiResponse(200, chatRoom, "Query updated"))
})

const allChats = asyncHandler(async (req, res) => {
    const userId = req.user?.id

    const data = await ChatRoom.find(
        {
            userId
        }
    ).select({ docId: 1, messages: { $slice: -1 }, createdAt: 1 })

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All chats fetched successfully"))
})

const deleteChat = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Something went wrong")
    }

    if (!isValidId(id)) {
        throw new ApiError(400, "Invalid Id")
    }

    const userId = req.user.id

    const chatRoom = await ChatRoom.findOneAndDelete({ userId, _id: id })    

    if (!chatRoom) {
        throw new ApiError(404, "Chat not found")
    }

    if (chatRoom.docId) {
        const documentId = chatRoom.docId
        Promise.all([
            Documents.findByIdAndDelete(documentId).catch(e =>
                logger.error("Doc metadata cleanup failed:", e)
            ),
            deleteDocumentVectors(userId, documentId).catch(e =>
                logger.error("Vector cleanup failed:", e)
            )
        ])
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Chat deleted successfully"))
})
export {
    uploadFile,
    askQuery,
    allChatsMessage,
    updateQuery,
    allChats,
    deleteChat
}