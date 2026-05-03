import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Async.js"
import {prisma } from "../prisma/index.js"

const register = asyncHandler(async(req, res)=>{
    const {name, email,password,grade} = req.body

    if(!name || !email || !password || !grade){
        throw new ApiError(400, "all fields are required")
    }

    const user = await prisma.user.create({
        name:"Kanchan Nath",
        email:"kanchan.nath.act@gmail.comn",
        password:"Kan_chan",
        grade:"UG - 1st Year"
    })
    console.log(user);
    
})

export {
    register
}