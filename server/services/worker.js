import { Worker } from "bullmq";

const connection = {
    host:"localhost",
    port:6379
}
const AIResponseQueueWorker = async (queueName) => {
    const worker = new Worker(queueName, async(job)=>{
        
        
    }, {connection})
}

AIResponseQueueWorker("ai-response")