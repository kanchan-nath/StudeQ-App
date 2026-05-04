import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/Async.js"
import prisma from "../lib/prisma.js"

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        console.log(req);
        
        const token = req.cookies?.accessToken

        if (!token) {
            throw new ApiError(401, "Unathorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        console.log("This is decoded token", decodedToken);

        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.userId,
            }
        })
        console.log(user);

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