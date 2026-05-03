import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Async.js"
import {prisma } from "../prisma/index.js"

const register = asyncHandler(async(req, res)=>{
    const {name, email,password,grade} = req.body

    if(!name || !email || !password || !grade){
        throw new ApiError(400, "all fields are required")
    }

    
})

export {
    register
}