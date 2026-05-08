import { app } from "./app.js"
import { connectDB } from "./lib/mongoClient.js"
import http from "http"
import {Server} from "socket.io"

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173"
    }
})

// io.on("connection",(socket)=>{
//     console.log(`${socket.id} is connected`);
// })

// io.on("disconnect", (socket) => {
//     console.log(`${socket.id} is disconnected`);
// })
const PORT = process.env.PORT

connectDB()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);

    })
})
.catch((error)=>{
    console.log("MONGO db connection failed !!! ", error);
})