import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Async.js"
import prisma from "../lib/prisma.js"

const verifyJWT = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    

    if (!token) {
        throw new ApiError(401, "Unathorized request")
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        if (error.name ==="TokenExpiredError"){
            throw new ApiError(401, "Access token expired")
        }
        throw new ApiError(401, "Invalid access token")
    }

    if(!decodedToken?.userId){
        throw new ApiError(401, "Invalid access token")
    }
    try {   
         decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

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