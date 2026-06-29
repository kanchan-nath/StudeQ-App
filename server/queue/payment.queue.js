import { Queue } from "bullmq"
import logger from "../logger/index.js"
import redisClient from "../lib/redisClient.js"

export const paymentQueue = new Queue('payment-events', {
    connection: redisClient,
    defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false, 
    },
});