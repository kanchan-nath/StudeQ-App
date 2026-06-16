import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/Async.js"
import mongoose from "mongoose"
import prisma from "../lib/prisma.js"
import redisClient from "../lib/redisClient.js"

const liveness = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, {
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || "development",
        }, "Server is alive")
    )
})

const readiness = asyncHandler(async (req, res) => {
    const checks = await Promise.allSettled([
        checkMongo(),
        checkPostgres(),
        checkRedis(),
    ])

    const [mongo, postgres, redis] = checks.map(parseCheck)

    const allHealthy = [mongo, postgres, redis].every(s => s.status === "ok")
    const httpStatus = allHealthy ? 200 : 503

    return res.status(httpStatus).json(
        new ApiResponse(httpStatus, {
            status: allHealthy ? "ok" : "degraded",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            services: { mongo, postgres, redis },
        }, allHealthy ? "All services healthy" : "One or more services degraded")
    )
})

async function checkMongo() {
    const state = mongoose.connection.readyState
    if (state !== 1) {
        throw new Error(`Mongoose readyState: ${state}`)
    }
    await mongoose.connection.db.command({ ping: 1 })
    return "MongoDB"
}

async function checkPostgres() {
    await prisma.$queryRaw`SELECT 1`
    return "PostgreSQL"
}

async function checkRedis() {
    const pong = await redisClient.ping()
    if (pong !== "PONG") throw new Error(`Unexpected ping reply: ${pong}`)
    return "Redis"
}

function parseCheck(settled) {
    if (settled.status === "fulfilled") {
        return { status: "ok", latency: null }
    }
    return {
        status: "down",
        error: settled.reason?.message || "Unknown error",
    }
}

export { liveness, readiness }