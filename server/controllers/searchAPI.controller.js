import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError, ApiResponse } from "../utils/Async.js"
import searchAPI from "../lib/searchAPI.js"

const MAX_QUERY_LENGTH = 200

const search = asyncHandler(async (req, res) => {
    const { query, filter, sort } = req.query

    if (!query) {
        throw new ApiError(400, "Query is required")
    }

    if (query.length > MAX_QUERY_LENGTH) {
        throw new ApiError(400, `Query must be under ${MAX_QUERY_LENGTH} characters`)
    }

    const { googleResponse, youtubeResponse } = await searchAPI(query)

    return res
        .status(200)
        .json(new ApiResponse(200, { googleResponse, youtubeResponse }, "Searched results"))
})

export {
    search
}