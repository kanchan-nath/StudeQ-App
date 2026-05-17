import mongoose from "mongoose"

const AIResponseSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    prompt:{
        type: String,
        required: true
    },
    response:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    promptTokens:{
        type: String,
        required: true
    },
    completionTokens: {
        type: String,
        required: true
    },
    totalTokens: {
        type: String,
        required: true
    },
    totalTime: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date
    }

},{timestamps:true})

export const AIResponse = mongoose.model("AIResponse", AIResponseSchema)