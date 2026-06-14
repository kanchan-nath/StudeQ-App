import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import { vectorDB, queryDB } from "../services/vectordb.js"
import llmCall from "../lib/groq/llmCall.js"
import { Documents } from "../models/document.model.js"
import { v4 as uuid4 } from "uuid"
import { ChatRoom } from "../models/chatRoom.model.js"
import mongoose from "mongoose"

const uploadFile = asyncHandler(async (req, res) => {
    const userId = req.user?.id

    const localFile = req.files?.file[0]
    
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
    const fileName = metadata.originalName

    await vectorDB(localFile, userId,chatRoomKey)
    await ChatRoom.create({
        userId,
        chatRoomKey,
        docId:id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { id, chatRoomKey, fileName  }, "Document's metadata uploaded successfully"))

})

const askQuery = asyncHandler(async (req, res) => {
    const { id, chatRoomKey } = req.params
    const userId = req.user.id

    if (!id || !chatRoomKey) {
        throw new ApiError(400, "Something went wrong")
    }
    const { query } = req.body

    if (!query) {
        throw new ApiError(400, "Query is not found")
    }

    const topChunks = await queryDB(query, userId)
    const results = await llmCall(query, topChunks, userId)

    await ChatRoom.findOneAndUpdate(
        {
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

const allChatsMessage = asyncHandler(async(req, res)=>{
    const { id, chatRoomKey } = req.params
    const userId = req.user.id

    if(!id || !chatRoomKey){
        throw new ApiError(400 , "Something went wrong")
    }

    const data = await ChatRoom.find(
        {
            chatRoomKey,
            userId
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, data, "All chats fetched"))
})

const updateQuery = asyncHandler(async(req, res)=>{
    const {id, chatRoomKey, chatId} = req.params
    const {query} = req.body
    const userId = req.user.id
    
    if(!id || !chatRoomKey || !chatId || !query){
        throw new ApiError(400, "Something went wrong")
    }

    const topChunks = await queryDB(query)

    if(!topChunks){
        throw new ApiError(400, "topChunks generation error")
    }
    const results = await llmCall(query, topChunks,userId)

    if (!results) {
        throw new ApiError(400, "Query answer problem, Try Again")
    }


    const chatRoom = await ChatRoom.findOne({ userId, chatRoomKey })

    const msgIndex = chatRoom.messages.findIndex(
        m => m._id.toString() == chatId
    )
    
    if (msgIndex === -1) throw new ApiError(404, "Message not found")

    const data = await ChatRoom.findOneAndUpdate(
        {
            userId,
            chatRoomKey,
            "messages._id": new mongoose.Types.ObjectId(chatId)
            
        },
        {
           $set:{
                [`messages.${msgIndex}.content`]: query, 
                [`messages.${msgIndex + 1}.content`]: results
           }
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, data, "Query upadated"))
})

const allChats = asyncHandler(async(req,res)=>{
    const userId = req.user?.id

    const data = await ChatRoom.find(
        {
            userId
        }
    ).select({ docId: 1, chatRoomKey: 1, messages: { $slice: 1 }, createdAt:1 })

    return res
    .status(200)
    .json(new ApiResponse(200, data, "All chats fetched successfully"))
})

const deleteChat = asyncHandler(async(req, res)=>{
    const {id} = req.params

    const userId = req.user.id

    const data = await ChatRoom.findOneAndDelete({userId, _id:id})
    
    return res
    .status(200)
    .json(new ApiResponse(200, data, "Vhat deleted"))
})
export {
    uploadFile,
    askQuery,
    allChatsMessage,
    updateQuery,
    allChats,
    deleteChat
}