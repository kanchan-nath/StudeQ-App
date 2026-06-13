// config/env.js
import dotenv from "dotenv"
if(!process.env.NODE_ENV){
    logger.warn("NODE_ENV not set — defaulting to development. DO NOT use in prod.")
}
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` })