import developmentLogger from "./developmentLogger.js"
import productionLogger from "./productionLogger.js"

const env = process.env.NODE_ENV || "development"
let logger = null

if (env === 'development') {
    logger = developmentLogger()
}

if (env === 'production') {
    logger = productionLogger()
}


export default logger