import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import searchAPI from "../lib/searchAPI.js"

const search = asyncHandler(async (req, res) => {
    const { query } = req.query

    if (!query) {
        throw new ApiError(400, "Query is required")
    }
    const { googleResponse, youtubeResponse } = await searchAPI(query)
    const data = { googleResponse, youtubeResponse }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Searched results"))
})

export {
    search
}