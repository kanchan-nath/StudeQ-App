import { app } from "./app.js"
import { connectDB } from "./lib/mongoClient.js"
import http from "http"
import jwt from "jsonwebtoken"
import { ApiError } from "./utils/Async.js"
import { initSocket } from "./lib/socket.js"
import { aiQueueEvents } from "./services/queueEvents.js"
import { tryCatch } from "bullmq"

const server = http.createServer(app)
const userSocketMap = new Map()

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
    console.log(`User is connected - ${socket.id}`);

    const {userId} = socket.data
    
    userSocketMap.set(userId, socket.id)
    console.log(userSocketMap);
    
    socket.on("join_room",async(data)=>{
        await socket.join(data.roomId)
        socket.data.roomId = data.roomId
        socket.to(data.roomId).emit("join_room_notice", data)
        
    })

    socket.on("send_message",(data)=>{
        console.log(data.roomId);
        
        io.to(data.roomId).emit("send_message", data)
    })
    socket.on("disconnect", () => {
        userSocketMap.delete(userId)  // cleanup
    })
    
})

const PORT = process.env.PORT

connectDB()
    .then(() => {
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running at ${PORT}`);

        })
    })
    .catch((error) => {
        console.log("MONGO db connection failed !!! ", error);
    })
