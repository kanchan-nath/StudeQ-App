import { Worker } from "bullmq";
import { summarizeText } from "../lib/groq/summarizer.js"

console.log("Worker started, listening on PORT 6379");

const connection = {
    host:"localhost",
    port:6379
}
const processJob = async (job)=>{
    const {data, userId} = job.data
    const result = await summarizeText(data)  
    
    return {result, userId}
    
}

const AIResponseQueueWorker = new Worker("ai-response-handler", processJob, {connection})


AIResponseQueueWorker.on('active', (job) => {
    console.log(">>> ACTIVE:", job.id);
})
AIResponseQueueWorker.on('completed', (job, result) => {
    console.log(">>>COMPLETED: ", result);
})
AIResponseQueueWorker.on('failed', (job, err) => {
    console.log(">>> FAILED:", err.message);
})