import jwt from "jsonwebtoken"

const generateAccessToken = (user)=>{
    return jwt.sign(
        {
            userId: user.id,
            email: user.email
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
            password: user.password,
            email: user.email
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