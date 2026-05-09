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

io.on("connection", (socket) => {
    console.log(`${socket.id} is connected`);

    socket.on("join_room", ({ roomId, username }) => {
        socket.join(roomId)

        socket.data.username = username
        socket.data.roomId = roomId

        socket.to(roomId).emit("user_joined", {
            username
        })
    })
    socket.on("send_message", ({ roomId, message, username, time }) => {
        socket.to(roomId).emit('receive-message', { username, message, time })
     })
    socket.on("typing", () => { })
    socket.on("disconnect", () => {
        socket.to(socket.data.roomId).emit("user_left", { username: socket.data.username });
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