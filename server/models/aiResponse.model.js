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
    tokenUsed:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date.now()
    }

},{timestamps:true})

export const AIResponse = mongoose.model("AIResponse", AIResponseSchema)