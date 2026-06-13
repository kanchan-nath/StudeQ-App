import { app } from "./app.js"
import { connectDB } from "./lib/mongoClient.js"
import http from "http"
import jwt from "jsonwebtoken"
import { ApiError } from "./utils/Async.js"
import { initSocket } from "./lib/socket.js"
import { aiQueueEvents } from "./services/queueEvents.js"
import logger from "./logger/index.js"
import { shutdownRedis } from "./lib/redisClient.js"

const isProd = process.env.NODE_ENV || "production"

const server = http.createServer(app)
const userSocketMap = new Map() //Need to improve more using redis

const io = initSocket(server)
aiQueueEvents(userSocketMap, io)

io.use((socket, next)=>{
    try {
        const token = socket.handshake.auth?.token

        if(!token){
            return next(new Error("Unauthorized: no token"))
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if(!decodedToken?.userId){
            return next(new Error("Unauthorized: invalid token payload"))
        }

        socket.data.userId = decodedToken.userId
        next()
    } catch (error) {
        next(new Error(`Unauthorized: ${err.message}`))
    }
})

io.on("connection",(socket)=>{
    const {userId} = socket.data

    if(isProd !== "production"){
        logger.info(`User Id ${userId} is connected - ${socket.id}`);
    }
    
    if(!userSocketMap.has(userId)){
        userSocketMap.set(userId, new Set())
    }

    userSocketMap.get(userId).add(socket.id)
    
    socket.on("join_room",async(data)=>{
        try {
            //Membership deltetion 
            await socket.join(data.roomId)
            socket.data.roomId = data.roomId
            socket.to(data.roomId).emit("join_room_notice", { userId, roomId: data.roomId })
        } catch (error) {
            socket.emit("error", { message: "Failed to join room" })
        }  
    })

    socket.on("send_message",(data)=>{
        if(!socket.rooms.has(data.roomId)){
            socket.emit("error", { message: "Not in this room" })
            return
        }
        
        io.to(data.roomId).emit("send_message", data)

        if (isProd !== "production") {
            logger.info(`Room Id: ${data.roomId}`);
        }
        
    })
    socket.on("disconnect", () => {
        const sockets = userSocketMap.get(userId)

        if(sockets){
            sockets.delete(socket.id)
            if (sockets.size === 0) userSocketMap.delete(userId)
        }
    })
    
})

const PORT = process.env.PORT || 3000
if (!PORT) {
    logger.error("FATAL: PORT env var not set")
    process.exit(1)
}

let httpServer
connectDB()
    .then(() => {
        httpServer = server.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server is running at ${PORT}`);

        })
    })
    .catch((error) => {
        logger.error("MONGO db connection failed !!! ", error);
    })

    const shutdown = async (signal)=>{
        logger.info(`${signal} received, shutting down gracefully...`)

        io.close(() => logger.info(`Socket.io closed`))

        httpServer?.close(()=>{
            logger.info("HTTP server closed")
            process.exit(0)
        })

        await shutdownRedis(signal)

        setTimeout(()=>process.exit(1), 10000)
    }

    process.on("SIGTERM",()=> shutdown("SIGTERM"))
    process.on("SIGINT", ()=> shutdown("SIGINT"))