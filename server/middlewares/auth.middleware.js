import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Async.js"
import prisma from "../lib/prisma.js"
import {createClerkClient} from "@clerk/express"

const verifyJWT = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log(token);
    

    if (!token) {
        throw new ApiError(401, "Unathorized request")
    }
    try {   
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.userId,
            },
            omit:{
                refreshToken:true,
                password:true
            }
        })

        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})


export { verifyJWT }