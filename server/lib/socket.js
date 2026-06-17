import { Server } from "socket.io"
import logger from "../logger/index.js"

let io

const initSocket = (httpServer)=>{

    if (io) {
        logger.warn("initSocket called more than once — returning existing instance")
        return io
    }
    const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
        .split(",")
        .map(o => o.trim())
        .filter(Boolean)

    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials:true
        },
        pingTimeout: 60_000,
        pingInterval: 25_000,
    })

    return io
}


const getIO = ()=>{
    if(!io){
        throw new Error("Socket.io not initialized — call initSocket(httpServer) first")
    }
    return io
}

export{
    initSocket,
    getIO
}