import "./configs/env.js"
import { app } from "./app.js"
import { connectDB } from "./lib/mongoClient.js"
import http from "http"
import net from "net"
import jwt from "jsonwebtoken"
import { ApiError } from "./utils/Async.js"
import { initSocket } from "./lib/socket.js"
import { aiQueueEvents } from "./services/queueEvents.js"
import logger from "./logger/index.js"
import { shutdownRedis } from "./lib/redisClient.js"
import { closeAIResponseQueue } from "./services/queue.js"
import { disconnectPrisma } from "./lib/prisma.js"
import cookie from "cookie"
import { seedPlansData } from "./controllers/payment.controller.js"

const isProd = process.env.NODE_ENV || "production"

const server = http.createServer(app)
const userSocketMap = new Map() //Need to improve more using redis

const io = initSocket(server)
aiQueueEvents(userSocketMap, io)

export const createSocketAuthMiddleware = ({
    cookieParse = cookie.parse,
    jwtVerify = jwt.verify,
    accessTokenSecret = process.env.ACCESS_TOKEN_SECRET,
} = {}) => (socket, next) => {
    try {
        const rawCookie = socket.handshake.headers.cookie || ""
        const token = cookieParse(rawCookie).accessToken
        if (!token) return next(new Error("Unauthorized: no token"))
        const decodedToken = jwtVerify(token, accessTokenSecret)
        if (!decodedToken?.userId) return next(new Error("Unauthorized: invalid token payload"))
        socket.data.userId = decodedToken.userId
        next()
    } catch (error) {
        next(new Error(`Unauthorized: ${error.message}`))
    }
}

io.use(createSocketAuthMiddleware())

io.on("connection", (socket) => {
    const { userId } = socket.data

    if (isProd !== "production") {
        logger.info(`User Id ${userId} is connected - ${socket.id}`);
    }

    if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set())
    }

    userSocketMap.get(userId).add(socket.id)

    socket.on("join_room", async (data) => {
        try {
            //Membership deltetion 
            await socket.join(data.roomId)
            socket.data.roomId = data.roomId
            socket.to(data.roomId).emit("join_room_notice", { userId, roomId: data.roomId })
        } catch (error) {
            socket.emit("error", { message: "Failed to join room" })
        }
    })

    socket.on("send_message", (data) => {
        if (!socket.rooms.has(data.roomId)) {
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

        if (sockets) {
            sockets.delete(socket.id)
            if (sockets.size === 0) userSocketMap.delete(userId)
        }
    })

})

const getAvailablePort = (preferredPort) => {
    return new Promise((resolve, reject) => {
        const tryPort = (port) => {
            const tester = net.createServer()

            tester.once("error", (error) => {
                if (error.code === "EADDRINUSE") {
                    tryPort(port + 1)
                    return
                }

                tester.close(() => reject(error))
            })

            tester.once("listening", () => {
                const address = tester.address()
                tester.close(() => resolve(address.port))
            })

            tester.listen(port, "0.0.0.0")
        }

        tryPort(preferredPort)
    })
}

const preferredPort = Number(process.env.PORT || 2000)
if (!preferredPort) {
    console.error("FATAL: PORT env var not set")
    process.exit(1)
}

let httpServer
connectDB()
    .then(async () => {
        console.log("[BOOT] DB ok, seeding...")
        await seedPlansData()
        console.log("[BOOT] Seed ok, binding", preferredPort)

        httpServer = server.listen(preferredPort, '0.0.0.0', () => {
            console.log(`Server is running at ${preferredPort}`)
        })

        httpServer.on("error", (error) => {
            console.error("HTTP server failed to start", error)
            process.exit(1)
        })
    })
    .catch((error) => {
        console.error("MONGO db connection failed !!! ", error)
        process.exit(1)
    })

const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down gracefully...`)

    io.close(() => logger.info(`Socket.io closed`))
    await shutdownRedis()
    await closeAIResponseQueue()
    await disconnectPrisma()
    httpServer?.close(() => {
        logger.info("HTTP server closed")
        process.exit(0)
    })
    setTimeout(() => process.exit(1), 10000)

}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))
