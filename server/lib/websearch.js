import { getJson } from "serpapi"

const webSearch = async (query) => {

    let response
    try {
         response = await getJson({
            engine: "google",
            api_key: process.env.SERP_API_KEY,
            q: `${query}`,
             location: process.env.SEARCH_LOCATION || "India" 
        })
    } catch (error) {
        throw new Error(`webSearch API call failed: ${error.message}`)
    }


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