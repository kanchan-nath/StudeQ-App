import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import {vectorDB, queryDB} from "../services/vectorDB.js"
import llmCall from "../lib/groq/llmCall.js"
import { Documents } from "../models/document.model.js"

const uploadFile = asyncHandler(async(req, res)=>{
    const userId = req.user?.id
    // const {query} = req.body
    
    // if(!query){
    //     throw new ApiError(400, "Type something")
    // }
    const localFile = req.files.file[0]
    
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

    if(!metadata){
        throw new ApiError(400, "metadata saving error")
    }
    await vectorDB(localFile)
    // const topChunks = await queryDB(query)
    
    // const results =await llmCall(query, topChunks)  
    
    // console.log(results);
    return res
    .status(200)
    .json(new ApiResponse(200, metadata._id, "Document's metadata uploaded successfully"))
    
})

const askQuery = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const userId = req.user.id
})

export {
    uploadFile,
    askQuery
}