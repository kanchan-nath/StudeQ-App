import mongoose from "mongoose"
import logger from "../logger/index.js"

const connectDB = async()=>{
try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`,
        {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: Number(process.env.MONGO_POOL_SIZE) || 10,
        }
    )
    logger.info("MongoDB connected", {
        host: connectionInstance.connection.host,
        db: connectionInstance.connection.name,
    })

    mongoose.connection.on("disconnected", () =>
        logger.warn("MongoDB disconnected — attempting reconnect...")
    )
    mongoose.connection.on("reconnected", () =>
        logger.info("MongoDB reconnected")
    )
    mongoose.connection.on("error", (err) =>
        logger.error("MongoDB runtime error:", err.message)
    )
    
} catch (error) {
    logger.error("MONGODB connection FAILED ", error.message);
    process.exit(1)
}
}

export {connectDB}