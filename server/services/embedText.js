import { pipeline } from "@xenova/transformers";

let embedderPromise = null

const getEmbedder = () => {
    if (!embedderPromise) {
        embedderPromise = pipeline("feature-extraction", "Xenova/bge-large-en-v1.5")
    }
    return embedderPromise
}

const embedText = async (text) => {

    const embedder = await getEmbedder()
    const output = await embedder(text, {
        pooling: "mean",
        normalize: true
    })

    return Array.from(output.data)
}

export default embedText