import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Async.js"
import {createClerkClient} from "@clerk/express"

const verifyClerkToken = asyncHandler(async(req, res, next)=>{

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if(!token){
            throw new ApiError(404, "Invalid token")
        }

        const decodedToken = await clerkClient.verifyClerkToken(token)
        console.log(token);
        req.clerkUserId = decodedToken.sub

        next()
        
    } catch (error) {
        console.error(error)
    }
})

