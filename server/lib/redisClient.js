import Redis from "ioredis"
import logger from "../logger/index.js"

const redisClient = new Redis(
    {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        lazyConnect: true,
    }
)

redisClient.on("connect", () => logger.info("Redis connected"))
redisClient.on("ready", () => logger.info(" Redis: ready to accept commands"))
redisClient.on("reconnecting", () => logger.warn("Redis: reconnecting..."))
redisClient.on("end", () => logger.warn("Redis: connection ended permanently"))
redisClient.on("error", (err) => logger.error("Redis error:", err.message))

export const shutdownRedis = async ()=>{
    try {
        await redisClient.quit(() => logger.info(" Redis: gracefully disconnected"))
    } catch (error) {
        logger.error(error)
        redisClient.disconnect()
    }
}
export default redisClient