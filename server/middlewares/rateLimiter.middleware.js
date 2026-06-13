import {rateLimit} from "express-rate-limit"
import {RedisStore} from "rate-limit-redis"
import redisClient from "../lib/redisClient.js"

const createLimiter = ({ windowMs, limit, prefix })=>{
    rateLimit(
        {
            windowMs,
            limit,
            statusCode:429,
            standardHeaders:"draft-8",
            legacyHeaders:false,
            store: new RedisStore(
                {
                    sendCommand: (...args)=> redisClient.call(...args),
                    prefix:`rl:${prefix}:`
                }
            )
        }
    )
}

export default limiter