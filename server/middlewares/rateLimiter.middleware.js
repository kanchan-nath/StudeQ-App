import {rateLimit} from "express-rate-limit"
import { ApiError, ApiResponse } from "../utils/Async.js"

const limiter = rateLimit(
    {
        windowMs:60*1000,
        limit:50,
        message: async(req, res)=>{
            throw new ApiError(429, `To many request from this IP: ${req.ip}`)
        },
        statusCode:429,
        standardHeaders: "draft-8",
        legacyHeaders: false
    }
)

export default limiter