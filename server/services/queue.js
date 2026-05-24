import { Queue } from "bullmq"

const connection = {
    host: "localhost",
    port: 6379,
}

const AIResponseQueue = async (userId, data) => {
    const queue = new Queue("ai-response-handler", {connection})
    console.log('Queue created:', queue.name);

    const jobData = {userId, data}
    await queue.add("ai-response-handler", jobData,{
        // delay: 5000,
        backoff:{
            type:"exponential",
            delay: 1000,
        },
        removeOnComplete:true,
        removeOnFail:false
    })
}
// AIResponseQueue("ai-response", {data:"Hello Z wrold"})

export {
    AIResponseQueue
}