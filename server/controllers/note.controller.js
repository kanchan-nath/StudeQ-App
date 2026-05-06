import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError, ApiResponse} from "../utils/Async.js"
import {summarizeText} from "../lib/summarizer.js"
import {Note} from "../models/note.model.js"

const createNote = asyncHandler(async(req, res)=>{
    const {content} = req.body
    const userId = req.user.id

    if(!content){
        throw new ApiError(400, "Content is required")
    }
    
    const result = await summarizeText(content)
    console.log(result);
    
    return res
    .status(200)
    .json(new ApiResponse(200, usr, "Content created successfuly"))
    
})

const getNote = asyncHandler(async()=>{

})

export {
    createNote,
    getNote
}