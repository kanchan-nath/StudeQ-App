import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import prisma from "../lib/prisma.js"
import { generateAccessToken, generateRefreshToken } from "../helpers/generateToken.js"
import bcrypt from "bcrypt"

const isPasswordCorrect = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

       return await bcrypt.compare(password, user.password)
    } catch (error) {
        throw new ApiError(400, "Incorrect password")
    }
}

const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10)

    } catch (error) {
        console.error("Password not hashed");

    }

}

const generateAccessAndRefreshToken = async (user) => {
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    const tokenUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            refreshToken: refreshToken
        }

    })    

    return { accessToken, refreshToken }

}

const register = asyncHandler(async (req, res) => {
    const { name, email, password, grade } = req.body

    if (!name || !email || !password || !grade) {
        throw new ApiError(400, "All fields are required")
    }

    const existingEmail = await prisma.user.findFirst({
        where: {
            email: email
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
        }
    })

    if (!newUser) {
        throw new ApiError(400, "user not created")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newUser))

})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

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

    const isPasswordValid = await isPasswordCorrect(email,password)

    if (!isPasswordValid){
        throw new ApiError(400, "Password not matched")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser)

    const options = {
        httpOnly: true,
        secure: true
    }

    const loggedInUser = await prisma.user.findUnique({
        where:{
            id:existedUser.id
        },
        omit:{
            refreshToken:true
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
        secure:true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const getUserData = asyncHandler(async(req, res)=>{
    const user = req.user
    
    return res
    .status(200)
    .json(new ApiResponse(200, user, "User data get successfully"))
    
})
export {
    register,
    login,
    logout,
    getUserData
}