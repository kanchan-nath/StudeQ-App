import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import prisma from "../lib/prisma.js"


const register = asyncHandler(async(req, res)=>{
    const {name, email,password,grade} = req.body

    if(!name || !email || !password || !grade){
        throw new ApiError(400, "all fields are required")
    }

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password,
            grade
        },
        omit:{
            password: true
        }
    })
    
    if(!newUser){
        throw new ApiError(400, "user not created")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, newUser))
    
})

export {
    register
}