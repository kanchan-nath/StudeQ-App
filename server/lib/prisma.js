import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from "pg"

if (!process.env.DATABASE_URL) {
    throw new Error("Missing required env var: DATABASE_URL")
}

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.DB_POOL_MAX) || 10,
    idleTimeoutMillis: 30_000, 
    connectionTimeoutMillis: 5_000,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"]
 })

export default prisma