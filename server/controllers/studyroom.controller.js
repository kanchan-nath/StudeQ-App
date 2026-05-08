import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import prisma from "../lib/prisma.js"

const createRoom = asyncHandler(async (req, res) => {
    const { name } = req.body
    const userId = req.user.id

    if (!name) {
        throw new ApiError(400, "Name is required to create study room")
    }

    const room = await prisma.studyRoom.findFirst({
        where: {
            createdById: userId,
            name
        }
    })

    if (room) {
        throw new ApiError(400,`Room is already created with this name "${name}"`
        )
    }

    const data = await prisma.studyRoom.create({
        data: {
            name,
            createdById: userId
        }
    })

    return res
        .status(200)
        .json(new ApiResponse(200,data,`"${name}" created successfully`))
})

const getAllRoom = asyncHandler(async (req, res) => {

})
export {
    createRoom,
    getAllRoom
}