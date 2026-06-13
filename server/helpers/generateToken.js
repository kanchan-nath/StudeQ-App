import jwt from "jsonwebtoken"
import crypto from "crypto"

const generateAccessToken = (user)=>{
    return jwt.sign(
        {
            userId: user.id,
            type:"access"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            type:"refresh",
            jti: crypto.randomUUID()
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export {
    generateAccessToken,
    generateRefreshToken
}