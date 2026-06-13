import { rateLimit } from "express-rate-limit"
import { RedisStore } from "rate-limit-redis"
import redisClient from "../lib/redisClient.js"

const createLimiter = ({ windowMs, limit, prefix }) => {
    return rateLimit(
        {
            windowMs,
            limit,
            statusCode: 429,
            standardHeaders: "draft-8",
            legacyHeaders: false,
            store: new RedisStore(
                {
                    sendCommand: (...args) => redisClient.call(...args),
                    prefix: `rl:${prefix}:`
                }
            ),
            handler: (req, res) => {
                res
                    .status(429)
                    .json(
                        {
                            success: false,
                            message: "Too many requests. Please try again later."
                        }
                    )
            }
        }
    )
}

export const generalLimiter = createLimiter(
    {
        windowMs: 60 * 1000, 
        limit: 100, 
        prefix: "general"
    }
)
export const authLimiter = createLimiter(
    {
        windowMs: 60 * 1000,
        limit: 5,
        prefix: "auth"
    }
)
export const aiLimiter = createLimiter(
    {
        windowMs: 60 * 1000,
        limit: 10,
        prefix: "ai"
    }
)
export default generalLimiter