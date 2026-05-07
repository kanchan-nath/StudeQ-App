import { getJson } from "serpapi"
import dotenv from "dotenv"

dotenv.config({
    path: "/Users/kanchannath/Coding/Spark.E/server/.env"
})
const webSearch = async (query) => {
    const response = await getJson({
        engine: "google",
        api_key: process.env.SERP_API_KEY,
        q: `${query}`,
        location: "India"
    })

    const result = response.organic_results
    
    const searchResult = result.map((item, index) => {
        return `
        Result: ${index + 1}

        Title: ${item.title}

        Link: ${item.link}

        Redirect_link: ${item.redirect_link}

        Snippet: ${item.snippet}

        Source: ${item.source}
        `
    }).join("\n")
    
    return searchResult

}
export { webSearch }