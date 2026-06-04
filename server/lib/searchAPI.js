import { getJson } from "serpapi"

const googleSearch = async (query) => {
    try {
        const response = await getJson("google", {
            api_key:"1ce583c86438f47c48be67baf82a6306ad7b829883838feee53a4d791785da2c", 
            q: query

        });


        return response
        
    } catch (error) {
        console.error("Error:", error.message);

    }
}

const youtubeSearch = async (query) => {
    try {
        const response = await getJson({
            engine: "youtube",
            search_query: query,
            api_key: "1ce583c86438f47c48be67baf82a6306ad7b829883838feee53a4d791785da2c",
            hl: "en", 
            gl: "us"  
        });

        return response

    } catch (error) {
        console.error("Error:", error.message);

    }
}

export {
    googleSearch,
    youtubeSearch
}