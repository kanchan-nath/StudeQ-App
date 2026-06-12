import {rateLimit} from "express-rate-limit"

const limiter = rateLimit(
    {
        windowMs:60*1000,
        limit:50,
        message:"Too many request from this IP, try again later! ",
        statusCode:429
    }
)