import { Server } from "socket.io"
import { ApiError } from "../utils/Async.js"

let io
const initSocket = (httpServer)=>{
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173"
        }
    })

    return io
}


const getIO = ()=>{
    if(!io){
        throw new ApiError(400, "Socket not initialized")
    }
    return io
}

export{
    initSocket,
    getIO
}