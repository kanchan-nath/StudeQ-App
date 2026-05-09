import { app } from "./app.js"
import { connectDB } from "./lib/mongoClient.js"
import http from "http"
import { Server } from "socket.io"

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on("connection",(socket)=>{
    console.log(`User is connected - ${socket.id}`);

    socket.on("join_room",async(data)=>{
        await socket.join(data.roomId)
        socket.data.roomId = data.roomId
        socket.to(data.roomId).emit("join_room_notice", data)
        
    })

    socket.on("send_message",(data)=>{
        console.log(data.roomId);
        
        io.to(data.roomId).emit("send_message", data)
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