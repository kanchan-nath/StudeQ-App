import { Worker } from "bullmq";
import { summarizeText } from "../lib/groq/summarizer.js"
import { Note } from "../models/note.model.js";
import logger from "../logger/index.js";

const host = process.env.REDIS_HOST
logger.info(`Worker started, listening on ${host}`);

import { Redis } from "ioredis"
const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
})
const processJob = async (job) => {
    const { data, userId } = job.data
    const result = await summarizeText(data)

    const content = job.data.data
    
    return { result, userId,content }

}

const AIResponseQueueWorker = new Worker("ai-response-handler", processJob, { connection })


AIResponseQueueWorker.on('active', (job) => {
    logger.info(`>>> ACTIVE: ${job.id}`);
})
AIResponseQueueWorker.on('completed', (job, result) => {
    console.log(">>>COMPLETED: ", result);
})
AIResponseQueueWorker.on('failed', (job, err) => {
    console.log(">>> FAILED:", err.message);
})