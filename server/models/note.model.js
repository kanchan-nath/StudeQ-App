import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    content:{
        type: String
    },
    summary:{
        type: String
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