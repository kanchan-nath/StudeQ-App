import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import prisma from "../lib/prisma.js"
import { generateAccessToken, generateRefreshToken } from "../helpers/generateToken.js"

const generateAccessAndRefreshToken = async(userId) => {
    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)

    await prisma.user.update({
        where: { id: userId },
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

    const newUser = await prisma.user.create({
        data: {
            name: name.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password,
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
    console.log(email)  

    const existedUser = await prisma.user.findUnique({
        where: {
            id: 5
        }
    })
console.log(existedUser);

    if (!existedUser) {
        throw new ApiError(400, "User not exist")
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(existedUser.id)


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("acces-token", accessToken, options)
    .cookie("refresh-token",refreshToken, options)
    .json(new ApiResponse(200, {existedUser, accessToken,refreshToken},"User login successfully"))

})
export {
    register,
    login
}