import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import prisma from "../lib/prisma.js"
import { generateAccessToken, generateRefreshToken } from "../helpers/generateToken.js"
import bcrypt from "bcrypt"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import logger from "../logger/index.js"
import { grantDailyLoginXP } from "../services/xpService.js"

const hashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, /*process.env.BCRYPT_SALT_ROUNDS*/ 10)
    if(!hashed){
        throw new ApiError(500, "Failed to process password")
    }

    return hashed
}
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
}

const generateAccessAndRefreshToken = async (user) => {
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    const hashedRefreshToken = await bcrypt.hash(refreshToken, /*process.env.REFRESH_TOKEN_SALT_ROUNDS*/ 8)

    if(!hashedRefreshToken){
        throw new ApiError(500, "Failed to procedd token")
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            refreshToken: hashedRefreshToken
        }

    })

    return { accessToken, refreshToken }

}

const register = asyncHandler(async (req, res) => {
    const {data, error} = registerValidator.safeParse(req.body)

    if(error){
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    }
    const { name, email, password, grade } = data

    if (!name || !email || !password || !grade) {
        throw new ApiError(400, "All fields are required")
    }

    const existingEmail = await prisma.user.findFirst({
        where: {
            email: email
        },
        select:{
            id:true
        }
    })

    if (existingEmail) {
        throw new ApiError(400, "Email already in use ")
    }

    const hashedPassword = await hashPassword(password)


    const newUser = await prisma.user.create({
        data: {
            name: name.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            grade: grade.toLowerCase().trim()
        },
        omit:{
            password: true,
            refreshToken:true
        }
    })

    if (!newUser) {
        throw new ApiError(500, "User creataion failed, Try again later")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newUser, "Registration successful"))

})

const login = asyncHandler(async (req, res) => {
    const { data, error } = loginValidator.safeParse(req.body)

    if (error) {
        throw new ApiError(400, error.issues.map(e => e.message).join(", "))
    } 

    const { email, password } = data

    if (!password || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await prisma.user.findUnique({
        where: {
            email: email
        },
        omit:{
            refreshToken:true
        }
    })

    const isUserValid = existedUser && await bcrypt.compare(password, existedUser.password)

    if (!isUserValid){
        throw new ApiError(404, "Invalid credentials")

    }

    
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser)
    
    const { password: _, ...safeUser} = existedUser

    let dailyXP = null
    try {
        dailyXP = await grantDailyLoginXP(existedUser.id)
    } catch (err) {
        logger.error("Daily XP failed:", err.message) // non-fatal
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: safeUser }, " Login successful"))

})

const logout = asyncHandler(async (req, res) => {
    await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null }
    })

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"))
})

const getUserData = asyncHandler(async (req, res) => {
    
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User data fetched successfully"))

})

export const verifyMe =asyncHandler(async(req, res)=>{
    
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User verified"))
})

export {
    register,
    login,
    logout,
    getUserData,
}