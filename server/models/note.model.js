import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    title:{
        type:String,

    },
    content:{
        type: String
    },
    summary:{
        type: String
    },
    keyPoints:{
        type: [String]
    },
    isPinned:{
        type :Boolean,
        default:false
    },
    createdAt:{
        type:Date
    }
}, {timestamps: true})

export const Note = mongoose.model("Note", noteSchema)