import {rateLimit} from "express-rate-limit"

const limiter = rateLimit(
    {
        windowMs:60*1000,
        limit:50,
        message: async(req, res)=>{
            return {
                success: false,
                message:`Too many request from this IP: ${req.ip}, try again later!`
            }
        },
        statusCode:429,
        standardHeaders: "draft-8",
        legacyHeaders: false
    }
)

export default limiter