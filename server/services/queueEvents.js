import { QueueEvents } from "bullmq";
import { ApiError } from "../utils/Async.js";
import { titleExtract } from "../controllers/note.controller.js";
import { Note } from "../models/note.model.js";

import { Redis } from "ioredis"
const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
})
const aiQueueEvents = async (userSocketMap, io)=>{
    const queueEvent = new QueueEvents("ai-response-handler", {connection})

    queueEvent.on("completed", async(event)=>{
        console.log(`Job Id Finished with ID:`, event.jobId);
        const { result, userId , content} = event.returnvalue

        const title = titleExtract(result)
            
            const responseData = await Note.create({
                userId,
                title,
                content:content,
                summary: result,
            })

            if(!responseData){
                throw new ApiError(404, "Data not saved")
            }
        
        const socketId = userSocketMap.get(userId)        

        if(!socketId){
            throw new ApiError(404, "Invalid Socket Id")
        }

        io.to(socketId).emit("ai-response", responseData)
        
    })
}

export {
    aiQueueEvents
}