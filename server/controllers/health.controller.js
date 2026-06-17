import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/Async.js"
import mongoose from "mongoose"
import prisma from "../lib/prisma.js"
import redisClient from "../lib/redisClient.js"

const withTimeout = (promise, ms = 3000, name = "check") =>
    Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${name} timed out after ${ms}ms`)), ms)
        )
    ])

const liveness = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, {
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),

        }, "Server is alive")
    )
})

const readiness = asyncHandler(async (req, res) => {
    const checks = await Promise.allSettled([
        withTimeout(checkMongo(), 3000, "MongoDB"),
        withTimeout(checkPostgres(), 3000, "PostgreSQL"),
        withTimeout(checkRedis(), 3000, "Redis"),
    ])

    const [mongo, postgres, redis] = checks.map(parseCheck)

    const allHealthy = [mongo, postgres, redis].every(s => s.status === "ok")
    const httpStatus = allHealthy ? 200 : 503

    return res.status(httpStatus).json(
        new ApiResponse(httpStatus, {
            status: allHealthy ? "ok" : "degraded",
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            services: { mongo, postgres, redis },
        }, allHealthy ? "All services healthy" : "One or more services degraded")
    )
})

async function checkMongo() {
    const start = Date.now()
    const state = mongoose.connection.readyState
    if (state !== 1) throw new Error(`Mongoose readyState: ${state}`)
    await mongoose.connection.db.command({ ping: 1 })
    return { name: "MongoDB", latency: Date.now() - start }
}

async function checkPostgres() {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    return { name: "PostgreSQL", latency: Date.now() - start }
}

async function checkRedis() {
    const start = Date.now()
    const pong = await redisClient.ping()
    if (pong !== "PONG") throw new Error(`Unexpected ping reply: ${pong}`)
    return { name: "Redis", latency: Date.now() - start }
}

function parseCheck(settled) {
    if (settled.status === "fulfilled") {
        return {
            status: "ok",
            name: settled.value.name,
            latencyMs: settled.value.latency
        }
    }
    return {
        status: "down",
        error: settled.reason?.message || "Unknown error",
    }
}

export { liveness, readiness }