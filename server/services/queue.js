import { Queue } from "bullmq"
import crypto from "crypto";
import logger from "../logger/index.js"
const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined
}

const aiResponseQueueInstance = new Queue("ai-response-handler", { connection })

const AIResponseQueue = async (userId, data) => {
    const jobId = crypto
        .createHash("sha256")
        .update(userId + JSON.stringify(data))
        .digest("hex");
    logger.info('Queue created:', aiResponseQueueInstance.name);

    if (!userId) {
        throw new Error("AIResponseQueue: userId is required")
    }

    const jobData = { userId, data }

    try {
        await aiResponseQueueInstance.add("ai-response-handler", jobData, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: {
                age: 24 * 3600,
                count: 1000
            },
            jobId: crypto
                .createHash("sha256")
                .update(userId + JSON.stringify(data))
                .digest("hex"),
        })
    } catch (error) {
        logger.error(`Failed to queue AI response job for user ${userId}:`, error)
        throw error
    }
}
export const closeAIResponseQueue = async () => {
    await aiResponseQueueInstance.close()
}

export {
    AIResponseQueue
}