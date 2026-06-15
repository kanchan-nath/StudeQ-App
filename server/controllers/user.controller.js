import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import prisma from "../lib/prisma.js"
import { generateAccessToken, generateRefreshToken } from "../helpers/generateToken.js"
import bcrypt from "bcrypt"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import logger from "../logger/index.js"

const hashPassword = async (password) => {
    const hashed = bcrypt.hash(password, process.env.HASH_PASSWORD_SALT_ROUND)
    if(!hashed){
        throw new ApiError(500, "Failed to process password")
    }

    return hashed
}

const generateAccessAndRefreshToken = async (user) => {
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    const hashedRefreshToken = bcrypt.hash(refreshToken, process.env.REFRESH_TOKEN_SALT_ROUND)

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
        }
    })

    if (!existedUser) {
        throw new ApiError(400, "User not exist")
    }

    const isPasswordValid = await isPasswordCorrect(email, password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Password not matched")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser)

    const options = {
        httpOnly: true,
        secure: true
    }

    const loggedInUser = await prisma.user.findUnique({
        where: {
            id: existedUser.id
        },
        omit: {
            refreshToken: true
        }
    })
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { loggedInUser, accessToken }, " login successfully"))

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
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const getUserData = asyncHandler(async (req, res) => {
    const user = req.user

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User data get successfully"))

})

export {
    register,
    login,
    logout,
    getUserData,
}