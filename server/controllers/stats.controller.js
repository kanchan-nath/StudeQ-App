import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse, ApiError } from "../utils/Async.js"
import prisma from "../lib/prisma.js"
import { computeStats } from "../services/xpService.js"

export const getStats = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { totalXp: true, streak: true },
    })

    if (!user) throw new ApiError(404, "User not found")

    const stats = computeStats(user.totalXp ?? 0)

    return res
        .status(200)
        .json(new ApiResponse(200, {
            streak: user.streak ?? 0,
            ...stats,
        }, "Stats fetched"))
})