import { QueueEvents } from "bullmq";
import { ApiError } from "../utils/Async.js";

const connection = {
    host:"localhost",
    port:6379
}
const aiQueueEvents = async (userSocketMap, io)=>{
    const queueEvent = new QueueEvents("ai-response-handler", {connection})

    queueEvent.on("completed", (event)=>{
        console.log(`Job Id Finished with ID:`, event.jobId);
        const { result, userId } = event.returnvalue
        
        const socketId = userSocketMap.get(userId)
        console.log(socketId);
        

        if(!socketId){
            throw new ApiError(404, "Invalid Socket Id")
        }

        io.to(socketId).emit("ai-response", result)
        
    })
}

export {
    aiQueueEvents
}