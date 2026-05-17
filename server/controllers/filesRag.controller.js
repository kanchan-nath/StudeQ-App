import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import {vectorDB, queryDB} from "../services/vectorDB.js"
import llmCall from "../lib/groq/llmCall.js"

const uploadFile = asyncHandler(async(req, res)=>{
    const userId = req.user?.id
    const {query} = req.body
    
    if(!query){
        throw new ApiError(400, "Type something")
    }
    const localFile = req.files.file[0]

    await vectorDB(localFile)
    const topChunks = await queryDB(query)
    
    const results =await llmCall(query, topChunks)  
    
    console.log(results);
    
})

export {
    uploadFile
}