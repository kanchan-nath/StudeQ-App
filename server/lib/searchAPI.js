import { getJson } from "serpapi"

const searchAPI = async (query) => {

    let googleResponse, youtubeResponse
    try {

        [googleResponse, youtubeResponse] = await Promise.all([
            getJson("google", {
                api_key: process.env.SERP_API_KEY,
                q: query,
                hl: "en",
                gl: "us"

            }),
            getJson({
                engine: "youtube",
                search_query: query,
                api_key: process.env.SERP_API_KEY,
                hl: "en",
                gl: "us"
            })
        ])

        return { googleResponse, youtubeResponse }

    } catch (error) {
        throw new Error(`searchAPI failed: ${error.message}`)
    }
}

export default searchAPI