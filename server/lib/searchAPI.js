import { getJson } from "serpapi"

const searchAPI = async (query) => {
    try {
        const googleResponse = await getJson("google", {
            api_key: process.env.SERP_API_KEY,
            q: query

        });
        const youtubeResponse = await getJson({
            engine: "youtube",
            search_query: query,
            api_key: process.env.SERP_API_KEY,
            hl: "en",
            gl: "us"
        });

        return { googleResponse, youtubeResponse }

    } catch (error) {
        console.error("Error:", error.message);

    }
}

export default searchAPI