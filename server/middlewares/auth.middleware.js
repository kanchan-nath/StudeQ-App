import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Async.js"
import prisma from "../lib/prisma.js"
import redisClient from "../lib/redisClient.js"
import logger from "../logger/index.js"

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

    if (decodedToken.type && decodedToken.type !== "access") {
        throw new ApiError(401, "Invalid token type")
    }

    const cacheKey = `user-cache:${decodedToken.userId}`

    try {
        const cached = await redisClient.get(cacheKey)
        if(cached){
            req.user = JSON.parse(cached)
            return next()
        }

    } catch (error) {
        logger.error("Redis cache miss (error):", error.message)
    }
    

    let user
    try {   

         user = await prisma.user.findUnique({
            where: {
                id: decodedToken.userId,
            },
            omit:{
                refreshToken:true,
                password:true
            }
        })
    } catch (error) {
        logger.error("DB error in verifyJWT:", error)
        throw new ApiError(500, "Something went wrong, please try again")
    }

    if(!user){
        throw new ApiError(401, "Invalid access token")
    }

    try {
        redisClient.setex(cacheKey, process.env.USER_CACHE_TTL, JSON.stringify(user), ()=>logger.info("User data saved in redis memory"))

    } catch (error) {
        logger.error("Redis set failed:", error)
    }

    req.user = user
    next()
})


export { verifyJWT }