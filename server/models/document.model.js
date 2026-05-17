import mongoose from "mongoose";

const documentsSchema = new mongoose.Schema({
    originalName:{
        type: String,
        required: true
    },
    encoding:{
        type:String,
        required: true
    },
    mimeType:{
        type: String,
        required: true
    },
    fileName:{
        type : String,
        required: true
    },
    size:{
        type: Number,
        required : true
    },
    userId:{
        type: String,
        required: true
    },
    
}, {timestamps:true})

export const Documents = mongoose.model("Documents", documentsSchema)