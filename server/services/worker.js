import { Worker } from "bullmq";

const connection = {
    host:"localhost",
    port:6379
}
const processJob = async (job)=>{
    console.log(`Job is processing with Id: ${job.id}`);
    console.log(`Job is processing Data: ${job.data}`);

    
}

const AIResponseQueueWorker = new Worker("ai-response-handler", processJob, {connection})