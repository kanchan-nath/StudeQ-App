import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import prisma from "../lib/prisma.js"
import { generateAccessToken, generateRefreshToken } from "../helpers/generateToken.js"
import bcrypt, { hashSync } from "bcrypt"

const hashPassword = async(password)=>{
    try {
        return await bcrypt.hash(password, 10)
         
    } catch (error) {
        console.error("Password not hashed");
        
    }
    
}

const generateAccessAndRefreshToken = async(userId) => {
    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)    

    const tokenUser = await prisma.user.update({
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
            email:email
        }
    })

    if (!existedUser) {
        throw new ApiError(400, "User not exist")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser.id)

    console.log(accessToken, refreshToken);
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(new ApiResponse(200, {existedUser, accessToken,refreshToken}," login successfully"))

})

const logout = asyncHandler(async(req, res)=>{
    await prisma.user.update({
        where:{
            id:user.id
        },
        data:{
            refreshToken:null
        }
    })

    return res
    .clearcookie
})
export {
    register,
    login,
    logout
}