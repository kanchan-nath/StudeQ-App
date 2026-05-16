import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { pipeline } from "@xenova/transformers";

const embedder = await pipeline("feature-extraction", "Xenova/bge-large-en-v1.5")

const embedText = async (text) => {

    const output = await embedder(text, {
        pooling: "mean",
        normalize: true
    })   

    return Array.from(output.data)
}

export default embedText