import { app } from "./app.js"
import { connectDB } from "./lib/mongoClient.js"
import http from "http"
import jwt from "jsonwebtoken"
import { ApiError } from "./utils/Async.js"
import {initSocket} from "../server/lib/socket.js"
import { aiQueueEvents } from "../server/services/queueEvents.js"

const server = http.createServer(app)
const userSocketMap = new Map()

const io = initSocket(server)
aiQueueEvents(userSocketMap, io)

io.use((socket, next)=>{
    const token = socket.handshake.auth.token

    if(!token){
        throw new ApiError(404, "Unathorize access")
    }
    next()
})

io.on("connection",(socket)=>{
    console.log(`User is connected - ${socket.id}`);

    const token = socket.handshake.auth.token

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const {userId} = decodedToken
    

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
        server.listen(PORT, () => {
            console.log(`Server is running at ${PORT}`);

        })
    })
    .catch((error) => {
        console.log("MONGO db connection failed !!! ", error);
    })
